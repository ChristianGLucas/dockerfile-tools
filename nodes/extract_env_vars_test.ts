import { DockerfileInput } from '../gen/messages_pb';
import { extractEnvVars } from './extract_env_vars';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractEnvVars', () => {
  it('extracts both ENV pairs from the fixture, unresolved variable references preserved verbatim', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractEnvVars(testContext, input);
    expect(result.getError()).toBe('');
    const vars = result.getVarsList();
    expect(vars).toHaveLength(2);
    expect(vars[0].getKey()).toBe('NODE_ENV');
    expect(vars[0].getValue()).toBe('${BUILD_ENV}');
    expect(vars[1].getKey()).toBe('PORT');
    expect(vars[1].getValue()).toBe('3000');
  });

  it('expands a multi-pair ENV instruction into one entry per pair', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nENV A=1 B=2 C=3\n');
    const result = extractEnvVars(testContext, input);
    expect(result.getVarsList().map((v) => [v.getKey(), v.getValue()])).toEqual([
      ['A', '1'],
      ['B', '2'],
      ['C', '3'],
    ]);
  });

  it('handles the legacy single-pair form (no "=")', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nENV NAME value with spaces\n');
    const result = extractEnvVars(testContext, input);
    const vars = result.getVarsList();
    expect(vars).toHaveLength(1);
    expect(vars[0].getKey()).toBe('NAME');
    expect(vars[0].getValue()).toBe('value with spaces');
  });
});
