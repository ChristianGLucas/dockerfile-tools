import { DockerfileInput, ParsedDockerfile, Comment as CommentMsg, ParserDirective as DirectiveMsg } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, computeStageIndices, toInstructionMsg } from './dockerfile_lib';

/**
 * Parse a Dockerfile into its full structured, ordered content: every
 * instruction (keyword, raw arguments, tokenized arguments, raw source
 * text, 1-based line range, and owning build-stage index), every comment,
 * and every parser directive (`# syntax=`, `# escape=`), all in source
 * order. This is the general-purpose parse every other node in this
 * package is a specialized view of. A best-effort parse never throws;
 * `error` is set only when the input itself is rejected (e.g. over the
 * size/line cap), in which case instructions/comments/directives are empty.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseDockerfile(ax: AxiomContext, input: DockerfileInput): ParsedDockerfile {
  const out = new ParsedDockerfile();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const instructions = df.getInstructions();
  const stageIndices = computeStageIndices(instructions);
  out.setInstructionsList(instructions.map((inst, i) => toInstructionMsg(inst, stageIndices[i])));

  out.setCommentsList(
    df.getComments().map((c) => {
      const m = new CommentMsg();
      m.setText(c.getContent());
      m.setLine(c.getRange().start.line + 1);
      return m;
    }),
  );

  out.setDirectivesList(
    df.getDirectives().map((d) => {
      const m = new DirectiveMsg();
      m.setName(d.getName());
      m.setValue(d.getValue());
      m.setLine(d.getRange().start.line + 1);
      return m;
    }),
  );

  out.setEscapeCharacter(df.getEscapeCharacter());
  return out;
}
