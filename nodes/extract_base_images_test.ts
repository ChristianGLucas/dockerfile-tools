import { DockerfileInput } from '../gen/messages_pb';
import { extractBaseImages } from './extract_base_images';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractBaseImages', () => {
  it('extracts one BaseImage per FROM with parsed repository/tag/alias, hand-verified', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractBaseImages(testContext, input);

    expect(result.getError()).toBe('');
    const images = result.getImagesList();
    expect(images).toHaveLength(3);

    expect(images[0].getRepository()).toBe('node');
    expect(images[0].getTag()).toBe('${NODE_VERSION}-alpine');
    expect(images[0].getStageAlias()).toBe('deps');
    expect(images[0].getStageIndex()).toBe(0);
    expect(images[0].getDigest()).toBe('');

    expect(images[1].getStageAlias()).toBe('builder');
    expect(images[1].getStageIndex()).toBe(1);

    expect(images[2].getStageAlias()).toBe(''); // unnamed final stage
    expect(images[2].getStageIndex()).toBe(2);
  });

  it('parses a pinned digest and an explicit registry/platform', () => {
    const input = new DockerfileInput();
    input.setContent(
      'FROM --platform=linux/amd64 docker.io/library/node@sha256:' + 'a'.repeat(64) + ' AS base\n',
    );
    const result = extractBaseImages(testContext, input);
    const img = result.getImagesList()[0];
    expect(img.getPlatform()).toBe('linux/amd64');
    expect(img.getDigest()).toBe('sha256:' + 'a'.repeat(64));
    expect(img.getTag()).toBe('');
    // dockerfile-ast's getImageName() strips a detected registry hostname
    // (docker.io, recognized by the dot) from the reported name.
    expect(img.getRepository()).toBe('library/node');
  });

  it('returns an empty list for a Dockerfile with no FROM', () => {
    const input = new DockerfileInput();
    input.setContent('RUN echo hi\n');
    const result = extractBaseImages(testContext, input);
    expect(result.getError()).toBe('');
    expect(result.getImagesList()).toHaveLength(0);
  });
});
