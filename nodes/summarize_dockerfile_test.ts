import { DockerfileInput } from '../gen/messages_pb';
import { summarizeDockerfile } from './summarize_dockerfile';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('SummarizeDockerfile', () => {
  it('summarizes the fixture matching the hand-derived counts and histogram exactly', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = summarizeDockerfile(testContext, input);

    expect(result.getError()).toBe('');
    expect(result.getTotalInstructions()).toBe(27);
    expect(result.getStageCount()).toBe(3);
    expect(result.getIsMultiStage()).toBe(true);
    expect(result.getHasHealthcheck()).toBe(true);
    expect(result.getExposedPortCount()).toBe(1);

    const histogram = result.getInstructionCountsList().map((h) => [h.getKeyword(), h.getCount()] as const);
    expect(histogram).toEqual([
      ['COPY', 5],
      ['ARG', 3],
      ['FROM', 3],
      ['RUN', 3],
      ['WORKDIR', 3],
      ['ENV', 2],
      ['LABEL', 2],
      ['CMD', 1],
      ['ENTRYPOINT', 1],
      ['EXPOSE', 1],
      ['HEALTHCHECK', 1],
      ['USER', 1],
      ['VOLUME', 1],
    ]);
    const totalFromHistogram = histogram.reduce((sum, [, count]) => sum + count, 0);
    expect(totalFromHistogram).toBe(27);
  });

  it('reports has_healthcheck=false when the only HEALTHCHECK is NONE', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nHEALTHCHECK NONE\n');
    const result = summarizeDockerfile(testContext, input);
    expect(result.getHasHealthcheck()).toBe(false);
  });

  it('counts multiple ports on one EXPOSE line individually', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nEXPOSE 80 443 8080\n');
    const result = summarizeDockerfile(testContext, input);
    expect(result.getExposedPortCount()).toBe(3);
  });
});
