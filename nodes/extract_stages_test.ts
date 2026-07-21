import { DockerfileInput } from '../gen/messages_pb';
import { extractStages } from './extract_stages';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE, STAGE_REF_DOCKERFILE, SIMPLE_DOCKERFILE } from './test_fixtures';

describe('ExtractStages', () => {
  it('extracts 3 stages, all with an external (non-stage-ref) base, hand-verified', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractStages(testContext, input);

    expect(result.getError()).toBe('');
    expect(result.getStageCount()).toBe(3);
    expect(result.getIsMultiStage()).toBe(true);
    const stages = result.getStagesList();
    expect(stages.map((s) => s.getName())).toEqual(['deps', 'builder', '']);
    expect(stages.every((s) => s.getBaseIsStageRef() === false)).toBe(true);
    expect(stages.every((s) => s.getBaseStageIndex() === -1)).toBe(true);
    // Hand-counted instructions per stage (see test_fixtures.ts comment).
    expect(stages[0].getInstructionCount()).toBe(4); // FROM,WORKDIR,COPY,RUN
    expect(stages[1].getInstructionCount()).toBe(5); // FROM,WORKDIR,COPY,COPY,RUN
    expect(stages[2].getInstructionCount()).toBe(16); // the rest (27 total - 2 pre-FROM ARGs - 4 - 5)
  });

  it('detects a stage that FROMs an earlier stage by name', () => {
    const input = new DockerfileInput();
    input.setContent(STAGE_REF_DOCKERFILE);
    const result = extractStages(testContext, input);
    const stages = result.getStagesList();
    expect(stages).toHaveLength(3);

    expect(stages[0].getName()).toBe('builder');
    expect(stages[0].getBaseIsStageRef()).toBe(false);

    expect(stages[1].getName()).toBe('test');
    expect(stages[1].getBaseImage()).toBe('builder');
    expect(stages[1].getBaseIsStageRef()).toBe(true);
    expect(stages[1].getBaseStageIndex()).toBe(0);

    expect(stages[2].getName()).toBe('');
    expect(stages[2].getBaseIsStageRef()).toBe(false);
  });

  it('reports is_multi_stage=false for a single-stage Dockerfile', () => {
    const input = new DockerfileInput();
    input.setContent(SIMPLE_DOCKERFILE);
    const result = extractStages(testContext, input);
    expect(result.getStageCount()).toBe(1);
    expect(result.getIsMultiStage()).toBe(false);
  });
});
