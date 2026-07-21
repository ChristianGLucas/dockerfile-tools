import { DockerfileInput } from '../gen/messages_pb';
import { extractEntrypointAndCmd } from './extract_entrypoint_and_cmd';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractEntrypointAndCmd', () => {
  it('extracts the exec-form ENTRYPOINT and CMD from the fixture', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractEntrypointAndCmd(testContext, input);
    expect(result.getError()).toBe('');

    expect(result.getHasEntrypoint()).toBe(true);
    expect(result.getEntrypointExecForm()).toBe(true);
    expect(result.getEntrypointArgsList()).toEqual(['node']);
    expect(result.getEntrypointShellString()).toBe('');

    expect(result.getHasCmd()).toBe(true);
    expect(result.getCmdExecForm()).toBe(true);
    expect(result.getCmdArgsList()).toEqual(['dist/server.js']);
  });

  it('reports the LAST of multiple CMDs (later overrides earlier)', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nCMD ["a"]\nCMD ["b", "c"]\n');
    const result = extractEntrypointAndCmd(testContext, input);
    expect(result.getCmdArgsList()).toEqual(['b', 'c']);
  });

  it('reports shell-form CMD with its raw string and whitespace-split args', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nCMD echo hello world\n');
    const result = extractEntrypointAndCmd(testContext, input);
    expect(result.getCmdExecForm()).toBe(false);
    expect(result.getCmdShellString()).toBe('echo hello world');
    expect(result.getCmdArgsList()).toEqual(['echo', 'hello', 'world']);
  });

  it('reports has_cmd=false and has_entrypoint=false when neither is present', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nRUN echo hi\n');
    const result = extractEntrypointAndCmd(testContext, input);
    expect(result.getHasCmd()).toBe(false);
    expect(result.getHasEntrypoint()).toBe(false);
  });
});
