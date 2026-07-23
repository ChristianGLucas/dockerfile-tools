# dockerfile-tools

Deterministic parsing and structural inspection of Dockerfiles / Containerfiles for the
[Axiom](https://axiomide.com) marketplace, published under the `christiangeorgelucas` handle.

Wraps [`dockerfile-ast`](https://github.com/rcjsuen/dockerfile-ast) (MIT), the parser behind the
official Docker VS Code extension — pure JavaScript/TypeScript, zero native dependencies.

Every node is a pure, stateless transform: a Dockerfile is always supplied as text by the caller.
There is no network access, no filesystem access, no image builds, and no reliance on wall-clock
time or randomness. Input is bounded (800 KB / 20,000 lines) and a malformed Dockerfile always
yields a structured result — never a crash.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/dockerfile-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/dockerfile-tools/ParseDockerfile --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/dockerfile-tools/0.1.0/ParseDockerfile \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/dockerfile-tools/ParseDockerfile`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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
