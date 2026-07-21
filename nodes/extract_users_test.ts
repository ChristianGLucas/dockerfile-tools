import { DockerfileInput } from '../gen/messages_pb';
import { extractUsers } from './extract_users';
import { testContext } from './test_context';
import { MULTI_STAGE_DOCKERFILE } from './test_fixtures';

describe('ExtractUsers', () => {
  it('extracts the single USER from the fixture, splitting user:group', () => {
    const input = new DockerfileInput();
    input.setContent(MULTI_STAGE_DOCKERFILE);
    const result = extractUsers(testContext, input);
    expect(result.getError()).toBe('');
    const users = result.getUsersList();
    expect(users).toHaveLength(1);
    expect(users[0].getUser()).toBe('app');
    expect(users[0].getGroup()).toBe('app');
    expect(result.getFinalUser()).toBe('app');
    expect(result.getFinalGroup()).toBe('app');
  });

  it('reports an empty group when USER has no ":group" part', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nUSER 1000\n');
    const result = extractUsers(testContext, input);
    const u = result.getUsersList()[0];
    expect(u.getUser()).toBe('1000');
    expect(u.getGroup()).toBe('');
  });

  it('reports empty final_user/final_group when no USER exists', () => {
    const input = new DockerfileInput();
    input.setContent('FROM alpine\nRUN echo hi\n');
    const result = extractUsers(testContext, input);
    expect(result.getUsersList()).toHaveLength(0);
    expect(result.getFinalUser()).toBe('');
  });
});
