import { ResolveStageBaseImageInput, ResolvedBaseImage } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse } from './dockerfile_lib';

function stageLabel(name: string | null, index: number): string {
  return name && name.length > 0 ? name : String(index);
}

/**
 * Resolve a named or indexed build stage to the real EXTERNAL base image
 * that ultimately backs it, walking any chain of "FROM <earlier-stage>"
 * references (multi-stage builds commonly layer stages on top of each
 * other). `stage` is matched by "AS <name>" alias first (case-insensitive,
 * matching Docker's own rule), falling back to a 0-based stage index given
 * as a decimal string. `resolution_chain` lists every stage identifier
 * walked, starting with the requested stage; `found`=false means the
 * requested stage does not exist in this Dockerfile.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function resolveStageBaseImage(ax: AxiomContext, input: ResolveStageBaseImageInput): ResolvedBaseImage {
  const out = new ResolvedBaseImage();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const froms = df.getFROMs();
  const aliasToIndex = new Map<string, number>();
  froms.forEach((from, i) => {
    const alias = from.getBuildStage();
    if (alias) aliasToIndex.set(alias.toLowerCase(), i);
  });

  const requested = input.getStage().trim();
  let startIndex: number | undefined;
  if (/^\d+$/.test(requested)) {
    const asIndex = parseInt(requested, 10);
    if (asIndex >= 0 && asIndex < froms.length) startIndex = asIndex;
  }
  if (startIndex === undefined) {
    startIndex = aliasToIndex.get(requested.toLowerCase());
  }

  if (startIndex === undefined) {
    out.setFound(false);
    return out;
  }
  out.setFound(true);

  const chain: string[] = [];
  let current = startIndex;
  const seen = new Set<number>();
  for (let steps = 0; steps <= froms.length; steps++) {
    if (seen.has(current)) {
      // A reference cycle would only occur in a malformed Dockerfile
      // (Docker itself rejects forward/self references) — stop instead of
      // looping forever, and report what we had resolved so far as external.
      out.setIsExternal(false);
      out.setResolutionChainList(chain);
      return out;
    }
    seen.add(current);
    chain.push(stageLabel(froms[current].getBuildStage(), current));

    const rawImage = froms[current].getImage() ?? '';
    const refIndex = aliasToIndex.get(rawImage.toLowerCase());
    if (refIndex !== undefined && refIndex < current) {
      current = refIndex;
      continue;
    }
    out.setResolvedImage(rawImage);
    out.setResolutionChainList(chain);
    out.setIsExternal(true);
    return out;
  }

  out.setResolutionChainList(chain);
  out.setIsExternal(false);
  return out;
}
