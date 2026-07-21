import { DockerfileInput, VolumeList, VolumeDecl as VolumeMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { Volume } from 'dockerfile-ast';
import { safeParse, startLine, unquoteJson } from './dockerfile_lib';

/**
 * Extract every VOLUME instruction's declared paths, in source order.
 * Handles both the JSON-array form (`VOLUME ["/data","/logs"]`) and the
 * space-separated shell form (`VOLUME /data /logs`) — each instruction's
 * paths are reported together as one entry, since a single VOLUME
 * instruction declares them jointly.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractVolumes(ax: AxiomContext, input: DockerfileInput): VolumeList {
  const out = new VolumeList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const volumes: VolumeMsg[] = [];
  for (const inst of df.getInstructions()) {
    if (inst.getKeyword() !== 'VOLUME' || !(inst instanceof Volume)) continue;
    const isExec = inst.getOpeningBracket() !== null;
    const paths = isExec
      ? inst.getJSONStrings().map((j) => unquoteJson(j.getValue()))
      : inst.getArguments().map((a) => a.getValue());
    const m = new VolumeMsg();
    m.setPathsList(paths);
    m.setRaw(inst.getTextContent());
    m.setLine(startLine(inst));
    volumes.push(m);
  }
  out.setVolumesList(volumes);
  return out;
}
