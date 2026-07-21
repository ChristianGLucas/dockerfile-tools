import { DockerfileInput } from '../gen/messages_pb';
import { extractExposedPorts } from './extract_exposed_ports';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractExposedPorts', () => {
  it('extracts a single resolved port from the fixture', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractExposedPorts(testContext, input);
    expect(result.getError()).toBe('');
    const ports = result.getPortsList();
    expect(ports).toHaveLength(1);
    expect(ports[0].getPort()).toBe(3000);
    expect(ports[0].getProtocol()).toBe('tcp');
    expect(ports[0].getResolved()).toBe(true);
    expect(ports[0].getRaw()).toBe('3000/tcp');
  });

  it('expands multiple ports on one EXPOSE line and defaults protocol to tcp', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nEXPOSE 80 443/tcp 53/udp\n');
    const result = extractExposedPorts(testContext, input);
    const ports = result.getPortsList();
    expect(ports).toHaveLength(3);
    expect(ports.map((p) => [p.getPort(), p.getProtocol()])).toEqual([
      [80, 'tcp'],
      [443, 'tcp'],
      [53, 'udp'],
    ]);
  });

  it('reports an unresolved port when the token is a build variable, never guessing a number', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nARG PORT=8080\nEXPOSE $PORT\n');
    const result = extractExposedPorts(testContext, input);
    const port = result.getPortsList()[0];
    expect(port.getResolved()).toBe(false);
    expect(port.getPort()).toBe(0);
    expect(port.getRaw()).toBe('$PORT');
  });
});
