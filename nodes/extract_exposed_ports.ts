import { DockerfileInput, PortList, Port as PortMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, startLine, parsePortToken } from './dockerfile_lib';

/**
 * Extract every port named across all EXPOSE instructions: the numeric
 * port, protocol ("tcp"/"udp", default "tcp"), and the raw token as
 * written. A single EXPOSE may list several ports/ranges-of-one at once
 * (`EXPOSE 80 443/tcp`); each expands to its own entry. A token that names
 * a build variable rather than a literal number (`EXPOSE $PORT`) is
 * reported with resolved=false and port=0 — this node never evaluates
 * ARG/ENV values.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractExposedPorts(ax: AxiomContext, input: DockerfileInput): PortList {
  const out = new PortList();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const ports: PortMsg[] = [];
  for (const inst of df.getInstructions()) {
    if (inst.getKeyword() !== 'EXPOSE') continue;
    const line = startLine(inst);
    for (const arg of inst.getArguments()) {
      const raw = arg.getValue();
      const { port, protocol, resolved } = parsePortToken(raw);
      const m = new PortMsg();
      m.setPort(port);
      m.setProtocol(protocol);
      m.setRaw(raw);
      m.setResolved(resolved);
      m.setLine(line);
      ports.push(m);
    }
  }
  out.setPortsList(ports);
  return out;
}
