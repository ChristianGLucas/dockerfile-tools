import { DockerfileInput, ArgList, Arg as ArgMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { Arg } from 'dockerfile-ast';
import { safeParse, startLine } from './dockerfile_lib';

/**
 * Extract every ARG declaration (name, default value, and whether a
 * default was given at all), in source order, including ARGs declared
 * before the first FROM (global build arguments). An ARG with no default
 * (`ARG FOO`) reports has_default=false and an empty default_value.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractArgs(ax: AxiomContext, input: DockerfileInput): ArgList {
  const out = new ArgList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const args: ArgMsg[] = [];
  for (const inst of df.getInstructions()) {
    if (inst.getKeyword() !== 'ARG' || !(inst instanceof Arg)) continue;
    const prop = inst.getProperty();
    const m = new ArgMsg();
    m.setName(prop ? prop.getName() : '');
    const value = prop ? prop.getValue() : null;
    m.setDefaultValue(value ?? '');
    m.setHasDefault(value !== null);
    m.setLine(startLine(inst));
    args.push(m);
  }
  out.setArgsList(args);
  return out;
}
