import { DockerfileInput, HealthcheckInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, startLine, findFlag } from './dockerfile_lib';

/**
 * Extract the single EFFECTIVE HEALTHCHECK — the last HEALTHCHECK
 * instruction in source order, since later HEALTHCHECK instructions
 * override earlier ones entirely. `present`=false means no HEALTHCHECK
 * exists at all. `is_none`=true means the last one is explicitly
 * "HEALTHCHECK NONE" (disabling any inherited healthcheck); `test_type`
 * is "CMD" or "CMD-SHELL" otherwise, with `command` holding the parsed
 * command tokens and `interval`/`timeout`/`start_period`/`retries`
 * carrying each flag's raw value (empty string when using Docker's
 * default for that flag).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractHealthcheck(ax: AxiomContext, input: DockerfileInput): HealthcheckInfo {
  const out = new HealthcheckInfo();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const healthchecks = df.getHEALTHCHECKs();
  if (healthchecks.length === 0) {
    out.setPresent(false);
    return out;
  }

  const last = healthchecks[healthchecks.length - 1];
  out.setPresent(true);
  const subcommand = last.getSubcommand();
  const subValue = subcommand ? subcommand.getValue() : '';
  const isNone = subValue === 'NONE';
  out.setIsNone(isNone);
  out.setTestType(isNone ? '' : subValue);

  const allArgs = last.getArguments().map((a) => a.getValue());
  out.setCommandList(isNone ? [] : allArgs.slice(1));

  const flags = last.getFlags();
  out.setInterval(findFlag(flags, 'interval') ?? '');
  out.setTimeout(findFlag(flags, 'timeout') ?? '');
  out.setStartPeriod(findFlag(flags, 'start-period') ?? '');
  out.setRetries(findFlag(flags, 'retries') ?? '');
  out.setLine(startLine(last));
  return out;
}
