import { DockerfileInput } from '../gen/messages_pb';
import { extractLabels } from './extract_labels';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractLabels', () => {
  it('extracts both LABELs from the fixture with quotes stripped', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractLabels(testContext, input);
    expect(result.getError()).toBe('');
    const labels = result.getLabelsList();
    expect(labels).toHaveLength(2);
    expect(labels[0].getKey()).toBe('maintainer');
    expect(labels[0].getValue()).toBe('platform@example.com');
    expect(labels[1].getKey()).toBe('version');
    expect(labels[1].getValue()).toBe('1.0.0');
  });

  it('expands a multi-pair LABEL instruction into one entry per pair', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nLABEL a="1" b="2"\n');
    const result = extractLabels(testContext, input);
    expect(result.getLabelsList().map((l) => [l.getKey(), l.getValue()])).toEqual([
      ['a', '1'],
      ['b', '2'],
    ]);
  });
});
