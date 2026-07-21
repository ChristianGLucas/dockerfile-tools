import { DockerfileInput } from '../gen/messages_pb';
import { parseDockerfile } from './parse_dockerfile';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE, SIMPLE_DOCKERFILE } from './test_fixtures';
import { MAX_CONTENT_BYTES } from './dockerfile_lib';

describe('ParseDockerfile', () => {
  it('parses a realistic multi-stage Dockerfile into the hand-verified instruction/comment/directive structure', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = parseDockerfile(testContext, input);

    expect(result.getError()).toBe('');
    expect(result.getInstructionsList()).toHaveLength(27);
    expect(result.getCommentsList()).toHaveLength(0);
    expect(result.getDirectivesList()).toHaveLength(1);
    expect(result.getDirectivesList()[0].getName()).toBe('syntax');
    expect(result.getDirectivesList()[0].getValue()).toBe('docker/dockerfile:1');
    expect(result.getEscapeCharacter()).toBe('\\');

    const first = result.getInstructionsList()[0];
    expect(first.getKeyword()).toBe('ARG');
    expect(first.getArguments()).toBe('NODE_VERSION=18');
    expect(first.getArgumentListList()).toEqual(['NODE_VERSION=18']);
    expect(first.getStartLine()).toBe(2);
    expect(first.getStageIndex()).toBe(-1); // before any FROM

    // Stage-index tracking: the last instruction (CMD) belongs to stage 2 (0-based, 3rd stage).
    const last = result.getInstructionsList()[result.getInstructionsList().length - 1];
    expect(last.getKeyword()).toBe('CMD');
    expect(last.getStageIndex()).toBe(2);

    // A RUN inside stage 1 (builder) reports stage_index=1.
    const buildRun = result.getInstructionsList().find((i) => i.getRaw() === 'RUN npm run build');
    expect(buildRun).toBeDefined();
    expect(buildRun!.getStageIndex()).toBe(1);
  });

  it('reports comments distinctly from parser directives', () => {
    const input = new DockerfileInput();
    input.setContent('# just a comment\nFROM alpine\n# another one\nRUN echo hi\n');
    const result = parseDockerfile(testContext, input);
    expect(result.getCommentsList()).toHaveLength(2);
    expect(result.getCommentsList()[0].getText()).toBe('just a comment');
    expect(result.getCommentsList()[0].getLine()).toBe(1);
    expect(result.getCommentsList()[1].getText()).toBe('another one');
    expect(result.getDirectivesList()).toHaveLength(0);
  });

  it('round-trips a multi-line RUN continuation as one instruction spanning the right line range', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nRUN apk add --no-cache \\\n    curl \\\n    bash\n');
    const result = parseDockerfile(testContext, input);
    const run = result.getInstructionsList().find((i) => i.getKeyword() === 'RUN');
    expect(run).toBeDefined();
    expect(run!.getStartLine()).toBe(2);
    expect(run!.getEndLine()).toBe(4);
  });

  it('returns an empty instruction list (not an error) for empty input', () => {
    const input = new DockerfileInput();
    input.setContent('');
    const result = parseDockerfile(testContext, input);
    expect(result.getError()).toBe('');
    expect(result.getInstructionsList()).toHaveLength(0);
  });

  it('rejects oversized input with a structured error instead of crashing', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\n' + 'RUN echo ' + 'x'.repeat(MAX_CONTENT_BYTES + 1000) + '\n');
    const result = parseDockerfile(testContext, input);
    expect(result.getError()).not.toBe('');
    expect(result.getInstructionsList()).toHaveLength(0);
  });

  it('is deterministic across repeated invocations on the same input', () => {
    const input = new DockerfileInput();
    input.setContent(SIMPLE_DOCKERFILE);
    const a = parseDockerfile(testContext, input);
    const b = parseDockerfile(testContext, input);
    expect(a.toObject()).toEqual(b.toObject());
  });
});
