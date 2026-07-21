import { DockerfileInput } from '../gen/messages_pb';
import { extractHealthcheck } from './extract_healthcheck';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE, HEALTHCHECK_NONE_DOCKERFILE } from './test_fixtures';

describe('ExtractHealthcheck', () => {
  it('extracts the CMD-form HEALTHCHECK from the fixture with all flags', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractHealthcheck(testContext, input);
    expect(result.getError()).toBe('');
    expect(result.getPresent()).toBe(true);
    expect(result.getIsNone()).toBe(false);
    expect(result.getTestType()).toBe('CMD');
    expect(result.getCommandList()).toEqual(['wget', '-qO-', 'http://localhost:3000/health', '||', 'exit', '1']);
    expect(result.getInterval()).toBe('30s');
    expect(result.getTimeout()).toBe('5s');
    expect(result.getRetries()).toBe('3');
    expect(result.getStartPeriod()).toBe(''); // not set in the fixture
  });

  it('reports present=false when no HEALTHCHECK instruction exists', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nRUN echo hi\n');
    const result = extractHealthcheck(testContext, input);
    expect(result.getPresent()).toBe(false);
  });

  it('reports is_none=true for "HEALTHCHECK NONE"', () => {
    const input = new DockerfileInput();
    input.setContent(HEALTHCHECK_NONE_DOCKERFILE);
    const result = extractHealthcheck(testContext, input);
    expect(result.getPresent()).toBe(true);
    expect(result.getIsNone()).toBe(true);
    expect(result.getTestType()).toBe('');
    expect(result.getCommandList()).toEqual([]);
  });

  it('parses CMD-SHELL form and reports only the LAST of multiple HEALTHCHECKs', () => {
    const input = new DockerfileInput();
    input.setContent(
      'FROM alpine\nHEALTHCHECK CMD curl -f http://x\nHEALTHCHECK --timeout=2s CMD-SHELL curl -f http://y || exit 1\n',
    );
    const result = extractHealthcheck(testContext, input);
    expect(result.getTestType()).toBe('CMD-SHELL');
    expect(result.getTimeout()).toBe('2s');
    expect(result.getCommandList()).toEqual(['curl', '-f', 'http://y', '||', 'exit', '1']);
  });
});
