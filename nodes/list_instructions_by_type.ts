import { ListInstructionsByTypeInput, InstructionList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, computeStageIndices, toInstructionMsg } from './dockerfile_lib';

/**
 * List every instruction of one keyword (e.g. "RUN", "COPY", "ENV"),
 * case-insensitively matched, in source order. The general-purpose
 * complement to the dedicated Extract* nodes — useful for keywords this
 * package doesn't give a typed view of (SHELL, STOPSIGNAL, ONBUILD,
 * MAINTAINER, ADD) or when the caller just wants the raw instruction list
 * for one keyword. An unknown/absent keyword returns an empty list, not
 * an error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listInstructionsByType(ax: AxiomContext, input: ListInstructionsByTypeInput): InstructionList {
  const out = new InstructionList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const wanted = input.getKeyword().trim().toUpperCase();
  const all = df.getInstructions();
  const stageIndices = computeStageIndices(all);
  const matched = all
    .map((inst, i) => ({ inst, stageIndex: stageIndices[i] }))
    .filter(({ inst }) => inst.getKeyword() === wanted);

  out.setInstructionsList(matched.map(({ inst, stageIndex }) => toInstructionMsg(inst, stageIndex)));
  out.setCount(matched.length);
  return out;
}
