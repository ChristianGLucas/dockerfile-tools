import { DockerfileInput } from '../gen/messages_pb';
import { validateDockerfile } from './validate_dockerfile';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE, SIMPLE_DOCKERFILE, INVALID_DOCKERFILE } from './test_fixtures';

describe('ValidateDockerfile', () => {
  it('reports valid=true with zero issues for a well-formed multi-stage Dockerfile', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = validateDockerfile(testContext, input);
    expect(result.getError()).toBe('');
    expect(result.getValid()).toBe(true);
    expect(result.getIssuesList()).toHaveLength(0);
  });

  it('reports valid=true for a simple single-stage Dockerfile', () => {
    const input = new DockerfileInput();
    input.setContent(SIMPLE_DOCKERFILE);
    const result = validateDockerfile(testContext, input);
    expect(result.getValid()).toBe(true);
  });

  it('flags RUN before the first FROM and an unrecognized keyword, with correct line numbers', () => {
    const input = new DockerfileInput();
    input.setContent(INVALID_DOCKERFILE);
    const result = validateDockerfile(testContext, input);
    expect(result.getValid()).toBe(false);

    const issues = result.getIssuesList();
    const errorIssues = issues.filter((i) => i.getSeverity() === 'error');
    expect(errorIssues.length).toBeGreaterThan(0);

    // "the first instruction must be ARG or FROM" — RUN is line 1.
    const firstInstructionIssue = issues.find((i) => i.getMessage().includes('first instruction'));
    expect(firstInstructionIssue).toBeDefined();
    expect(firstInstructionIssue!.getLine()).toBe(1);

    // BOGUSCMD (line 2) is reported as an unrecognized-keyword WARNING, not an error —
    // dockerfile-ast parses it without complaint, so this node can only warn, not assert
    // with certainty that a real `docker build` would reject it.
    const unknownKeywordIssue = issues.find((i) => i.getMessage().includes('unrecognized instruction keyword'));
    expect(unknownKeywordIssue).toBeDefined();
    expect(unknownKeywordIssue!.getSeverity()).toBe('warning');
    expect(unknownKeywordIssue!.getLine()).toBe(2);
  });

  it('flags a Dockerfile with no FROM instruction at all', () => {
    const input = new DockerfileInput();
    input.setContent('ARG FOO=1\nRUN echo hi\n');
    const result = validateDockerfile(testContext, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().some((i) => i.getMessage().includes('at least one FROM'))).toBe(true);
  });

  it('allows multiple ARGs before the first FROM without flagging them', () => {
    const input = new DockerfileInput();
    input.setContent('ARG A=1\nARG B=2\nFROM alpine\n');
    const result = validateDockerfile(testContext, input);
    expect(result.getValid()).toBe(true);
    expect(result.getIssuesList()).toHaveLength(0);
  });
});
