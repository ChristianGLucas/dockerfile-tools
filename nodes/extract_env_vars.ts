import { DockerfileInput, EnvVarList, EnvVar as EnvVarMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { Env } from 'dockerfile-ast';
import { safeParse, startLine } from './dockerfile_lib';

/**
 * Extract every ENV key/value pair, in source order. A multi-pair
 * instruction (`ENV a=1 b=2`) expands to one entry per pair; the legacy
 * single-pair form (`ENV KEY value`) yields one entry. A key declared with
 * no value (malformed) reports an empty string value, never an error for
 * the whole node.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractEnvVars(ax: AxiomContext, input: DockerfileInput): EnvVarList {
  const out = new EnvVarList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const vars: EnvVarMsg[] = [];
  for (const inst of df.getInstructions()) {
    if (inst.getKeyword() !== 'ENV' || !(inst instanceof Env)) continue;
    const line = startLine(inst);
    for (const prop of inst.getProperties()) {
      const m = new EnvVarMsg();
      m.setKey(prop.getName());
      m.setValue(prop.getValue() ?? '');
      m.setLine(line);
      vars.push(m);
    }
  }
  out.setVarsList(vars);
  return out;
}
