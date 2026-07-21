import { DockerfileInput } from '../gen/messages_pb';
import { extractArgs } from './extract_args';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractArgs', () => {
  it('extracts all 3 ARGs, including the no-default re-declaration, hand-verified', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractArgs(testContext, input);
    expect(result.getError()).toBe('');
    const args = result.getArgsList();
    expect(args).toHaveLength(3);

    expect(args[0].getName()).toBe('NODE_VERSION');
    expect(args[0].getDefaultValue()).toBe('18');
    expect(args[0].getHasDefault()).toBe(true);

    expect(args[1].getName()).toBe('BUILD_ENV');
    expect(args[1].getDefaultValue()).toBe('production');
    expect(args[1].getHasDefault()).toBe(true);

    // Re-declared inside the final stage with no default.
    expect(args[2].getName()).toBe('BUILD_ENV');
    expect(args[2].getDefaultValue()).toBe('');
    expect(args[2].getHasDefault()).toBe(false);
  });
});
