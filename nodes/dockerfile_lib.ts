// Shared helpers for every dockerfile-tools node: bounded, deterministic
// wrapping of dockerfile-ast (MIT, rcjsuen/dockerfile-ast — the parser
// behind the Docker VS Code extension). No network, no filesystem, no
// wall-clock, no randomness — every node is a pure text-in, structured-out
// transform of a caller-supplied Dockerfile string.

import { DockerfileParser } from 'dockerfile-ast';
import type { Dockerfile } from 'dockerfile-ast';
import type { Instruction as AstInstruction } from 'dockerfile-ast';
import { Instruction as InstructionMsg, Issue as IssueMsg } from '../gen/messages_pb';

/**
 * Parses `content` with dockerfile-ast. dockerfile-ast itself never throws
 * on malformed Dockerfiles — it always returns a best-effort AST — so this
 * only reports an error if the underlying library ever violates that
 * contract; everything else is "parse succeeded, possibly with issues".
 * Input size/line-count are the platform's concern, not this node's.
 */
export function safeParse(content: string): { df: Dockerfile | null; error: string | null } {
  try {
    const df = DockerfileParser.parse(content);
    return { df, error: null };
  } catch (e) {
    // Defensive only: dockerfile-ast's own contract is "never throws", but a
    // wrapper must not crash the process if that contract is ever violated.
    return { df: null, error: `parse failed: ${e instanceof Error ? e.message : String(e)}` };
  }
}

/** 1-based line number from a dockerfile-ast (0-based) range start. */
export function startLine(inst: { getRange(): { start: { line: number } } }): number {
  return inst.getRange().start.line + 1;
}

export function endLine(inst: { getRange(): { end: { line: number } } }): number {
  return inst.getRange().end.line + 1;
}

/**
 * Strips one layer of surrounding double quotes (as used by JSON-array
 * CMD/ENTRYPOINT/VOLUME/SHELL forms) and resolves the standard JSON escapes.
 * dockerfile-ast's getJSONStrings() returns each element WITH its quotes
 * still attached (verified empirically — not documented), so every caller
 * that wants the bare string value must go through this.
 */
export function unquoteJson(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed) as string;
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

/**
 * Looks up a flag's value by name from a ModifiableInstruction's flag list.
 * Several dedicated accessors in dockerfile-ast 0.7.1 (e.g. Copy.getFromFlag())
 * are unreliable — empirically, Copy.getFromFlag() returns null whenever a
 * second flag such as --link is also present on the same instruction, in
 * EITHER order — so every node in this package reads flags generically via
 * getFlags() instead of trusting a keyword-specific accessor.
 */
export function findFlag(
  flags: Array<{ getName(): string; getValue(): string | null }>,
  name: string,
): string | null {
  const f = flags.find((fl) => fl.getName() === name);
  return f ? f.getValue() ?? '' : null;
}

export function hasFlag(
  flags: Array<{ getName(): string; getValue(): string | null }>,
  name: string,
): boolean {
  return flags.some((fl) => fl.getName() === name);
}

/**
 * Computes the 0-based build-stage index for every instruction in document
 * order: the index starts at 0 and increments on every FROM (including the
 * first), so instructions before any FROM (only ARG is legal there) are
 * reported as stage -1.
 */
export function computeStageIndices(instructions: AstInstruction[]): number[] {
  const indices: number[] = [];
  let stage = -1;
  for (const inst of instructions) {
    if (inst.getKeyword() === 'FROM') {
      stage++;
    }
    indices.push(stage);
  }
  return indices;
}

/** Builds a proto Instruction message from a dockerfile-ast instruction. */
export function toInstructionMsg(inst: AstInstruction, stageIndex: number): InstructionMsg {
  const msg = new InstructionMsg();
  msg.setKeyword(inst.getKeyword());
  msg.setArguments(inst.getArgumentsContent() ?? '');
  msg.setArgumentListList(inst.getArguments().map((a) => a.getValue()));
  msg.setRaw(inst.getTextContent());
  msg.setStartLine(startLine(inst));
  msg.setEndLine(endLine(inst));
  msg.setStageIndex(stageIndex);
  return msg;
}

/** Builds a proto Issue message. */
export function toIssue(line: number, column: number, severity: string, message: string): IssueMsg {
  const msg = new IssueMsg();
  msg.setLine(line);
  msg.setColumn(column);
  msg.setSeverity(severity);
  msg.setMessage(message);
  return msg;
}

/**
 * Parses an EXPOSE port token ("8080", "8080/tcp", "$PORT") into
 * {port, protocol, resolved}. A token that isn't a plain decimal number
 * (e.g. it names a build variable) is reported unresolved rather than
 * guessed at.
 */
export function parsePortToken(raw: string): { port: number; protocol: string; resolved: boolean } {
  const slash = raw.indexOf('/');
  const numPart = slash === -1 ? raw : raw.slice(0, slash);
  const protocol = slash === -1 ? 'tcp' : raw.slice(slash + 1).toLowerCase() || 'tcp';
  if (/^\d+$/.test(numPart)) {
    return { port: parseInt(numPart, 10), protocol, resolved: true };
  }
  return { port: 0, protocol, resolved: false };
}
