import { DockerfileInput } from '../gen/messages_pb';
import { extractVolumes } from './extract_volumes';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractVolumes', () => {
  it('extracts the exec-form VOLUME from the fixture with quotes stripped', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractVolumes(testContext, input);
    expect(result.getError()).toBe('');
    const volumes = result.getVolumesList();
    expect(volumes).toHaveLength(1);
    expect(volumes[0].getPathsList()).toEqual(['/app/data']);
  });

  it('extracts a shell-form VOLUME with multiple paths as one entry', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nVOLUME /data /logs\n');
    const result = extractVolumes(testContext, input);
    const volumes = result.getVolumesList();
    expect(volumes).toHaveLength(1);
    expect(volumes[0].getPathsList()).toEqual(['/data', '/logs']);
  });
});
