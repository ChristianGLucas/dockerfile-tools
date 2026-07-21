import { DockerfileInput, CopyInstructionList, CopyInstruction as CopyMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { Copy, Add } from 'dockerfile-ast';
import { safeParse, startLine, findFlag, hasFlag } from './dockerfile_lib';

/**
 * Extract every COPY and ADD instruction: source paths/URLs/globs,
 * destination, and the `--from` (build-stage source, COPY only),
 * `--chown`, `--chmod`, and `--link` modifiers, in source order. Sources
 * are every argument but the last; destination is the last. Flags are
 * read positionally by name rather than via dockerfile-ast's own
 * `Copy.getFromFlag()`, which empirically returns null whenever a second
 * flag (e.g. `--link`) is present alongside `--from` — this node does not
 * inherit that gap.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractCopyAndAdd(ax: AxiomContext, input: DockerfileInput): CopyInstructionList {
  const out = new CopyInstructionList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const instructions: CopyMsg[] = [];
  for (const inst of df.getInstructions()) {
    const kw = inst.getKeyword();
    if (kw !== 'COPY' && kw !== 'ADD') continue;
    if (!(inst instanceof Copy) && !(inst instanceof Add)) continue;

    const values = inst.getArguments().map((a) => a.getValue());
    const destination = values.length > 0 ? values[values.length - 1] : '';
    const sources = values.length > 1 ? values.slice(0, -1) : [];
    const flags = inst.getFlags();

    const m = new CopyMsg();
    m.setKeyword(kw);
    m.setSourcesList(sources);
    m.setDestination(destination);
    m.setFromStage(kw === 'COPY' ? findFlag(flags, 'from') ?? '' : '');
    m.setChown(findFlag(flags, 'chown') ?? '');
    m.setChmod(findFlag(flags, 'chmod') ?? '');
    m.setLink(hasFlag(flags, 'link'));
    m.setRaw(inst.getTextContent());
    m.setLine(startLine(inst));
    instructions.push(m);
  }
  out.setInstructionsList(instructions);
  return out;
}
