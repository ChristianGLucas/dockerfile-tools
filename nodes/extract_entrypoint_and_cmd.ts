import { DockerfileInput, EntrypointCmd } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, startLine, unquoteJson } from './dockerfile_lib';

/**
 * Extract the FINAL effective CMD and ENTRYPOINT — the last occurrence of
 * each in source order, which is what Docker actually uses for the final
 * image regardless of how many earlier stages redefine them. Reports each
 * in both forms: `*_exec_form` (true for the JSON-array `["exe","arg"]`
 * form) plus `*_args` (the parsed elements either way), and
 * `*_shell_string` (the raw shell-form string, empty when exec-form).
 * has_cmd/has_entrypoint are false when the instruction never appears at
 * all.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractEntrypointAndCmd(ax: AxiomContext, input: DockerfileInput): EntrypointCmd {
  const out = new EntrypointCmd();
  const { df, error } = safeParse(input.getContent());
  if (error !== null || df === null) {
    out.setError(error ?? 'unknown parse error');
    return out;
  }

  const cmds = df.getCMDs();
  if (cmds.length > 0) {
    const last = cmds[cmds.length - 1];
    const isExec = last.getOpeningBracket() !== null;
    out.setHasCmd(true);
    out.setCmdExecForm(isExec);
    if (isExec) {
      out.setCmdArgsList(last.getJSONStrings().map((j) => unquoteJson(j.getValue())));
      out.setCmdShellString('');
    } else {
      out.setCmdArgsList(last.getArguments().map((a) => a.getValue()));
      out.setCmdShellString(last.getArgumentsContent() ?? '');
    }
    out.setCmdLine(startLine(last));
  }

  const entrypoints = df.getENTRYPOINTs();
  if (entrypoints.length > 0) {
    const last = entrypoints[entrypoints.length - 1];
    const isExec = last.getOpeningBracket() !== null;
    out.setHasEntrypoint(true);
    out.setEntrypointExecForm(isExec);
    if (isExec) {
      out.setEntrypointArgsList(last.getJSONStrings().map((j) => unquoteJson(j.getValue())));
      out.setEntrypointShellString('');
    } else {
      out.setEntrypointArgsList(last.getArguments().map((a) => a.getValue()));
      out.setEntrypointShellString(last.getArgumentsContent() ?? '');
    }
    out.setEntrypointLine(startLine(last));
  }

  return out;
}
