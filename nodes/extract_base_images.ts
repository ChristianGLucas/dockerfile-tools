import { DockerfileInput, BaseImageList, BaseImage as BaseImageMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, startLine } from './dockerfile_lib';

/**
 * Extract every FROM instruction's parsed base-image reference: raw text,
 * repository, tag, digest, `--platform` flag, the stage's own "AS <name>"
 * alias, and its 0-based stage index — one entry per build stage, in
 * source order. When a stage's FROM refers to an earlier stage by name
 * (multi-stage builds) rather than an external image, `repository` carries
 * that stage's name as written — use ExtractStages/ResolveStageBaseImage
 * to distinguish that case and follow it to the real external image.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractBaseImages(ax: AxiomContext, input: DockerfileInput): BaseImageList {
  const out = new BaseImageList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const froms = df.getFROMs();
  out.setImagesList(
    froms.map((from, index) => {
      const m = new BaseImageMsg();
      m.setRaw(from.getImage() ?? '');
      m.setRepository(from.getImageName() ?? '');
      m.setTag(from.getImageTag() ?? '');
      m.setDigest(from.getImageDigest() ?? '');
      const platformFlag = from.getPlatformFlag();
      m.setPlatform(platformFlag ? platformFlag.getValue() ?? '' : '');
      m.setStageAlias(from.getBuildStage() ?? '');
      m.setStageIndex(index);
      m.setLine(startLine(from));
      return m;
    }),
  );
  return out;
}
