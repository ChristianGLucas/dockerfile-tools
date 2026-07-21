# dockerfile-tools

Deterministic parsing and structural inspection of Dockerfiles / Containerfiles for the
[Axiom](https://axiom.co) marketplace, published under the `christiangeorgelucas` handle.

Wraps [`dockerfile-ast`](https://github.com/rcjsuen/dockerfile-ast) (MIT), the parser behind the
official Docker VS Code extension — pure JavaScript/TypeScript, zero native dependencies.

Every node is a pure, stateless transform: a Dockerfile is always supplied as text by the caller.
There is no network access, no filesystem access, no image builds, and no reliance on wall-clock
time or randomness. Input is bounded (2 MB / 20,000 lines) and a malformed Dockerfile always
yields a structured result — never a crash.

## Nodes

| Node | What it does |
|---|---|
| `ParseDockerfile` | Full structured parse: every instruction, comment, and parser directive, in source order |
| `ListInstructionsByType` | All instructions of one keyword (e.g. every `RUN`) |
| `ExtractBaseImages` | Every `FROM`'s parsed image reference (repository, tag, digest, platform, stage alias) |
| `ExtractStages` | Build stages of a multi-stage build, with stage-to-stage base references resolved |
| `ExtractExposedPorts` | Every `EXPOSE`d port and protocol |
| `ExtractEnvVars` | Every `ENV` key/value pair |
| `ExtractArgs` | Every `ARG` declaration, with its default (if any) |
| `ExtractCopyAndAdd` | Every `COPY`/`ADD`: sources, destination, `--from`, `--chown`, `--chmod`, `--link` |
| `ExtractEntrypointAndCmd` | The final effective `CMD` and `ENTRYPOINT` (exec vs. shell form) |
| `ExtractLabels` | Every `LABEL` key/value pair |
| `ExtractVolumes` | Every declared `VOLUME` |
| `ExtractWorkdirs` | Every `WORKDIR`, plus the final effective one |
| `ExtractUsers` | Every `USER`, plus the final effective one |
| `ExtractHealthcheck` | The effective `HEALTHCHECK` (or its absence/`NONE`) |
| `ResolveStageBaseImage` | Walks a named/indexed stage to the real external image that backs it |
| `SummarizeDockerfile` | Instruction counts, histogram, stage count, healthcheck/port summary |
| `ValidateDockerfile` | Basic structural correctness (e.g. first instruction must be `ARG`/`FROM`), with line numbers |

## License

MIT — see [LICENSE](./LICENSE). `dockerfile-ast` and its two runtime dependencies
(`vscode-languageserver-types`, `vscode-languageserver-textdocument`) are all MIT-licensed.

Built for the Axiom marketplace.
