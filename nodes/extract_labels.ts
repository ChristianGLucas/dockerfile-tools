import { DockerfileInput, LabelList, Label as LabelMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { Label } from 'dockerfile-ast';
import { safeParse, startLine } from './dockerfile_lib';

/**
 * Extract every LABEL key/value pair, in source order. A single
 * instruction may set multiple labels at once (`LABEL a="1" b="2"`); each
 * expands to its own entry.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractLabels(ax: AxiomContext, input: DockerfileInput): LabelList {
  const out = new LabelList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const labels: LabelMsg[] = [];
  for (const inst of df.getInstructions()) {
    if (inst.getKeyword() !== 'LABEL' || !(inst instanceof Label)) continue;
    const line = startLine(inst);
    for (const prop of inst.getProperties()) {
      const m = new LabelMsg();
      m.setKey(prop.getName());
      m.setValue(prop.getValue() ?? '');
      m.setLine(line);
      labels.push(m);
    }
  }
  out.setLabelsList(labels);
  return out;
}
