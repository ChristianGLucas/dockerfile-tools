import { DockerfileInput, WorkdirList, Workdir as WorkdirMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { Workdir } from 'dockerfile-ast';
import { safeParse, startLine } from './dockerfile_lib';

/**
 * Extract every WORKDIR instruction's path, in source order, plus
 * `final_workdir` — the path from the LAST WORKDIR in the whole file
 * (empty if none). Paths are reported exactly as written (relative or
 * absolute); this node does not resolve a relative WORKDIR against an
 * earlier one.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractWorkdirs(ax: AxiomContext, input: DockerfileInput): WorkdirList {
  const out = new WorkdirList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const workdirs: WorkdirMsg[] = [];
  for (const inst of df.getInstructions()) {
    if (inst.getKeyword() !== 'WORKDIR' || !(inst instanceof Workdir)) continue;
    const m = new WorkdirMsg();
    m.setPath(inst.getPath() ?? '');
    m.setLine(startLine(inst));
    workdirs.push(m);
  }
  out.setWorkdirsList(workdirs);
  out.setFinalWorkdir(workdirs.length > 0 ? workdirs[workdirs.length - 1].getPath() : '');
  return out;
}
