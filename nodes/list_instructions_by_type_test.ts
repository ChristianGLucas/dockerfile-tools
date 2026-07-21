import { ListInstructionsByTypeInput } from '../gen/messages_pb';
import { listInstructionsByType } from './list_instructions_by_type';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ListInstructionsByType', () => {
  it('lists exactly the 5 COPY instructions, in source order, hand-verified against the fixture', () => {
    const input = new ListInstructionsByTypeInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    input.setKeyword('COPY');
    const result = listInstructionsByType(testContext, input);

    expect(result.getError()).toBe('');
    expect(result.getCount()).toBe(5);
    expect(result.getInstructionsList()).toHaveLength(5);
    expect(result.getInstructionsList().map((i) => i.getArguments())).toEqual([
      'package.json package-lock.json ./',
      '/app/node_modules ./node_modules',
      '. .',
      '/app/dist ./dist',
      '/app/node_modules ./node_modules',
    ]);
  });

  it('matches case-insensitively', () => {
    const input = new ListInstructionsByTypeInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    input.setKeyword('run');
    const result = listInstructionsByType(testContext, input);
    expect(result.getCount()).toBe(3);
    expect(result.getInstructionsList().every((i) => i.getKeyword() === 'RUN')).toBe(true);
  });

  it('returns an empty list, not an error, for a keyword absent from the Dockerfile', () => {
    const input = new ListInstructionsByTypeInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    input.setKeyword('ONBUILD');
    const result = listInstructionsByType(testContext, input);
    expect(result.getError()).toBe('');
    expect(result.getCount()).toBe(0);
  });
});
