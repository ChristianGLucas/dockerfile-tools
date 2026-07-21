import { DockerfileInput, DockerfileSummary, InstructionCount } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse } from './dockerfile_lib';

/**
 * Summarize a Dockerfile's structure: total instruction count, line count,
 * stage count / multi-stage flag, an instruction-type histogram
 * (descending by count), whether an active (non-NONE) HEALTHCHECK exists,
 * and the total number of EXPOSE'd ports. A quick "what's in this
 * Dockerfile" overview without walking the full instruction list yourself.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarizeDockerfile(ax: AxiomContext, input: DockerfileInput): DockerfileSummary {
  const out = new DockerfileSummary();
  const content = input.getContent();
  const { df, error } = safeParse(content);
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const instructions = df.getInstructions();
  out.setTotalInstructions(instructions.length);
  out.setLineCount(content.length === 0 ? 0 : content.split('\n').length);

  const froms = df.getFROMs();
  out.setStageCount(froms.length);
  out.setIsMultiStage(froms.length > 1);

  const counts = new Map<string, number>();
  let exposedPortCount = 0;
  for (const inst of instructions) {
    const kw = inst.getKeyword();
    counts.set(kw, (counts.get(kw) ?? 0) + 1);
    if (kw === 'EXPOSE') {
      exposedPortCount += inst.getArguments().length;
    }
  }
  const histogram = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([keyword, count]) => {
      const m = new InstructionCount();
      m.setKeyword(keyword);
      m.setCount(count);
      return m;
    });
  out.setInstructionCountsList(histogram);
  out.setExposedPortCount(exposedPortCount);

  const healthchecks = df.getHEALTHCHECKs();
  let hasHealthcheck = false;
  if (healthchecks.length > 0) {
    const last = healthchecks[healthchecks.length - 1];
    const subcommand = last.getSubcommand();
    hasHealthcheck = !!subcommand && subcommand.getValue() !== 'NONE';
  }
  out.setHasHealthcheck(hasHealthcheck);

  return out;
}
