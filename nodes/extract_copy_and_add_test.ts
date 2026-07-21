import { DockerfileInput } from '../gen/messages_pb';
import { extractCopyAndAdd } from './extract_copy_and_add';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractCopyAndAdd', () => {
  it('extracts all 5 COPY instructions with sources/destination/from/chown split correctly', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractCopyAndAdd(testContext, input);
    expect(result.getError()).toBe('');
    const copies = result.getInstructionsList();
    expect(copies).toHaveLength(5);
    expect(copies.every((c) => c.getKeyword() === 'COPY')).toBe(true);

    expect(copies[0].getSourcesList()).toEqual(['package.json', 'package-lock.json']);
    expect(copies[0].getDestination()).toBe('./');
    expect(copies[0].getFromStage()).toBe('');

    expect(copies[1].getSourcesList()).toEqual(['/app/node_modules']);
    expect(copies[1].getDestination()).toBe('./node_modules');
    expect(copies[1].getFromStage()).toBe('deps');

    expect(copies[3].getFromStage()).toBe('builder');
    expect(copies[3].getChown()).toBe('app:app');
  });

  it('reads --from correctly even when --link is also present (dockerfile-ast getFromFlag() is unreliable there)', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine AS base\nFROM alpine\nCOPY --from=base --link /a /b\n');
    const result = extractCopyAndAdd(testContext, input);
    const c = result.getInstructionsList()[0];
    expect(c.getFromStage()).toBe('base');
    expect(c.getLink()).toBe(true);
  });

  it('extracts ADD instructions with keyword="ADD" and from_stage always empty (ADD has no --from)', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nADD --chmod=644 https://example.com/f.tar.gz /tmp/\n');
    const result = extractCopyAndAdd(testContext, input);
    const a = result.getInstructionsList()[0];
    expect(a.getKeyword()).toBe('ADD');
    expect(a.getSourcesList()).toEqual(['https://example.com/f.tar.gz']);
    expect(a.getDestination()).toBe('/tmp/');
    expect(a.getChmod()).toBe('644');
    expect(a.getFromStage()).toBe('');
  });
});
