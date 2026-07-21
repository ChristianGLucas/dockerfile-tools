import { ResolveStageBaseImageInput } from '../gen/messages_pb';
import { resolveStageBaseImage } from './resolve_stage_base_image';
import { testContext } from './test_context';
import { STAGE_REF_DOCKERFILE } from './test_fixtures';

describe('ResolveStageBaseImage', () => {
  it('walks a two-hop chain (test -> builder -> external) to the real external image', () => {
    const input = new ResolveStageBaseImageInput();
    input.setContent(STAGE_REF_DOCKERFILE);
    input.setStage('test');
    const result = resolveStageBaseImage(testContext, input);
    expect(result.getError()).toBe('');
    expect(result.getFound()).toBe(true);
    expect(result.getIsExternal()).toBe(true);
    expect(result.getResolvedImage()).toBe('alpine:3.19');
    expect(result.getResolutionChainList()).toEqual(['test', 'builder']);
  });

  it('resolves a stage with no chain (already external) in one hop', () => {
    const input = new ResolveStageBaseImageInput();
    input.setContent(STAGE_REF_DOCKERFILE);
    input.setStage('builder');
    const result = resolveStageBaseImage(testContext, input);
    expect(result.getIsExternal()).toBe(true);
    expect(result.getResolvedImage()).toBe('alpine:3.19');
    expect(result.getResolutionChainList()).toEqual(['builder']);
  });

  it('resolves by 0-based numeric index as well as by name', () => {
    const input = new ResolveStageBaseImageInput();
    input.setContent(STAGE_REF_DOCKERFILE);
    input.setStage('1'); // "test" is stage index 1
    const result = resolveStageBaseImage(testContext, input);
    expect(result.getFound()).toBe(true);
    expect(result.getResolutionChainList()).toEqual(['test', 'builder']);
  });

  it('reports found=false for a stage that does not exist', () => {
    const input = new ResolveStageBaseImageInput();
    input.setContent(STAGE_REF_DOCKERFILE);
    input.setStage('nonexistent');
    const result = resolveStageBaseImage(testContext, input);
    expect(result.getFound()).toBe(false);
  });
});
