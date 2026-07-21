import { DockerfileInput, UserList, UserDecl as UserMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, startLine } from './dockerfile_lib';

/**
 * Extract every USER instruction, in source order, splitting the
 * `user[:group]` argument into its parts, plus `final_user`/`final_group`
 * — from the LAST USER in the whole file (empty if none), the user the
 * final image actually runs as.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractUsers(ax: AxiomContext, input: DockerfileInput): UserList {
  const out = new UserList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const users: UserMsg[] = [];
  for (const inst of df.getInstructions()) {
    if (inst.getKeyword() !== 'USER') continue;
    const args = inst.getArguments();
    const raw = args.length > 0 ? args[0].getValue() : '';
    const colon = raw.indexOf(':');
    const user = colon === -1 ? raw : raw.slice(0, colon);
    const group = colon === -1 ? '' : raw.slice(colon + 1);
    const m = new UserMsg();
    m.setUser(user);
    m.setGroup(group);
    m.setRaw(raw);
    m.setLine(startLine(inst));
    users.push(m);
  }
  out.setUsersList(users);
  if (users.length > 0) {
    const last = users[users.length - 1];
    out.setFinalUser(last.getUser());
    out.setFinalGroup(last.getGroup());
  }
  return out;
}
