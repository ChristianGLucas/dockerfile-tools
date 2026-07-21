import { DockerfileInput, StageList, Stage as StageMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, startLine, computeStageIndices } from './dockerfile_lib';

/**
 * Extract the build stages of a (possibly single-stage) Dockerfile: one
 * entry per FROM, in source order, with its 0-based index, its own "AS
 * <name>" alias (empty if unnamed), its base image, whether that base is
 * an external image or a reference to an earlier stage
 * (base_is_stage_ref/base_stage_index), and how many instructions belong
 * to it. `is_multi_stage` is true iff more than one FROM is present.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractStages(ax: AxiomContext, input: DockerfileInput): StageList {
  const out = new StageList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const froms = df.getFROMs();
  const allInstructions = df.getInstructions();
  const stageIndices = computeStageIndices(allInstructions);
  const counts = new Array(froms.length).fill(0);
  for (const idx of stageIndices) {
    if (idx >= 0 && idx < counts.length) counts[idx]++;
  }

  // Map stage alias name (case-insensitive, Docker's own matching rule) -> its index.
  const aliasToIndex = new Map<string, number>();
  froms.forEach((from, i) => {
    const alias = from.getBuildStage();
    if (alias) aliasToIndex.set(alias.toLowerCase(), i);
  });

  out.setStagesList(
    froms.map((from, index) => {
      const m = new StageMsg();
      m.setIndex(index);
      m.setName(from.getBuildStage() ?? '');
      const rawImage = from.getImage() ?? '';
      const refIndex = aliasToIndex.get(rawImage.toLowerCase());
      const isStageRef = refIndex !== undefined && refIndex < index; // a stage can only reference an EARLIER stage
      m.setBaseImage(rawImage);
      m.setBaseIsStageRef(isStageRef);
      m.setBaseStageIndex(isStageRef ? (refIndex as number) : -1);
      const platformFlag = from.getPlatformFlag();
      m.setPlatform(platformFlag ? platformFlag.getValue() ?? '' : '');
      m.setFromLine(startLine(from));
      m.setInstructionCount(counts[index]);
      return m;
    }),
  );
  out.setIsMultiStage(froms.length > 1);
  out.setStageCount(froms.length);
  return out;
}
