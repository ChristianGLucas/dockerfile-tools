import { DockerfileInput, ValidationResult, Issue as IssueMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { Keyword } from 'dockerfile-ast';
import { safeParse, startLine, toIssue } from './dockerfile_lib';

const KNOWN_KEYWORDS: Set<string> = new Set(Object.values(Keyword) as string[]);

/**
 * Run a basic structural-correctness pass and report issues with 1-based
 * line numbers — NOT a full Docker build validation, only checks that are
 * confidently decidable from syntax alone: (1) the Dockerfile contains at
 * least one FROM; (2) the first instruction is ARG or FROM (Docker allows
 * only ARG before the first FROM); (3) every instruction before the first
 * FROM is itself an ARG; (4) every instruction keyword is one Docker
 * actually recognizes (unknown keywords are reported as warnings, since
 * dockerfile-ast parses them without complaint but a real `docker build`
 * would reject them). `valid` is true iff no "error"-severity issue was
 * found; warnings do not affect it.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateDockerfile(ax: AxiomContext, input: DockerfileInput): ValidationResult {
  const out = new ValidationResult();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const issues: IssueMsg[] = [];
  const instructions = df.getInstructions();

  if (df.getFROMs().length === 0) {
    issues.push(toIssue(0, 0, 'error', 'Dockerfile must contain at least one FROM instruction'));
  }

  if (instructions.length > 0) {
    const first = instructions[0];
    if (first.getKeyword() !== 'ARG' && first.getKeyword() !== 'FROM') {
      issues.push(
        toIssue(
          startLine(first),
          0,
          'error',
          `the first instruction must be ARG or FROM, found ${first.getKeyword()}`,
        ),
      );
    }
  }

  let sawFrom = false;
  for (const inst of instructions) {
    const kw = inst.getKeyword();
    if (kw === 'FROM') {
      sawFrom = true;
    } else if (!sawFrom && kw !== 'ARG') {
      issues.push(
        toIssue(startLine(inst), 0, 'error', `only ARG instructions are allowed before the first FROM, found ${kw}`),
      );
    }
    if (!KNOWN_KEYWORDS.has(kw)) {
      issues.push(toIssue(startLine(inst), 0, 'warning', `unrecognized instruction keyword: ${kw}`));
    }
  }

  out.setIssuesList(issues);
  out.setValid(!issues.some((i) => i.getSeverity() === 'error'));
  return out;
}
