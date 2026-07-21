import { DockerfileInput } from '../gen/messages_pb';
import { extractWorkdirs } from './extract_workdirs';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractWorkdirs', () => {
  it('extracts all 3 WORKDIR instructions from the fixture and reports the final one', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractWorkdirs(testContext, input);
    expect(result.getError()).toBe('');
    const workdirs = result.getWorkdirsList();
    expect(workdirs).toHaveLength(3);
    expect(workdirs.every((w) => w.getPath() === '/app')).toBe(true);
    expect(result.getFinalWorkdir()).toBe('/app');
  });

  it('reports the LAST WORKDIR as final_workdir when they differ', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nWORKDIR /a\nWORKDIR sub\n');
    const result = extractWorkdirs(testContext, input);
    expect(result.getWorkdirsList().map((w) => w.getPath())).toEqual(['/a', 'sub']);
    expect(result.getFinalWorkdir()).toBe('sub');
  });

  it('reports empty final_workdir when no WORKDIR exists', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nRUN echo hi\n');
    const result = extractWorkdirs(testContext, input);
    expect(result.getWorkdirsList()).toHaveLength(0);
    expect(result.getFinalWorkdir()).toBe('');
  });
});
