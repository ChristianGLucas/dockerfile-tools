// Shared test fixtures for dockerfile-tools node tests. NOT a test file
// itself (jest.config.js only collects nodes/**/*_test.ts), just realistic
// Dockerfile text reused across many node tests, with hand-verified
// expected structure documented alongside each one — the independent
// oracle every test below checks its node's output against.

/**
 * A realistic 3-stage production Node.js Dockerfile (deps -> builder ->
 * final), 27 instructions, hand-counted below. Every stage pulls FROM an
 * external image directly (no stage-references-another-stage FROM) — see
 * MULTI_STAGE_WITH_STAGE_REF for that case.
 *
 * Hand-verified structure (the independent oracle for tests that use this
 * fixture):
 *   - 27 instructions total, 3 stages (deps=0, builder=1, unnamed=2), multi-stage=true
 *   - 1 parser directive (syntax), 0 comments
 *   - ARGs: NODE_VERSION=18 (has default), BUILD_ENV=production (has default),
 *           BUILD_ENV (no default, re-declared in stage 2)
 *   - ENVs: NODE_ENV=${BUILD_ENV}, PORT=3000
 *   - LABELs: maintainer=platform@example.com, version=1.0.0
 *   - 5 COPY, 0 ADD
 *   - EXPOSE: 3000/tcp (1 port)
 *   - VOLUME: ["/app/data"] (exec form)
 *   - USER: app:app (final_user=app, final_group=app)
 *   - HEALTHCHECK: interval=30s timeout=5s retries=3 start_period=(empty)
 *     CMD wget -qO- http://localhost:3000/health || exit 1
 *   - ENTRYPOINT: exec ["node"]; CMD: exec ["dist/server.js"]
 *   - WORKDIR: /app x3 (one per stage), final_workdir=/app
 *   - instruction histogram (desc, ties alpha): COPY=5, ARG=3, FROM=3, RUN=3,
 *     WORKDIR=3, ENV=2, LABEL=2, CMD=1, ENTRYPOINT=1, EXPOSE=1, HEALTHCHECK=1,
 *     USER=1, VOLUME=1
 */
export const MULTI_STAGE_DOCKERFILE = `# syntax=docker/dockerfile:1
ARG NODE_VERSION=18
ARG BUILD_ENV=production

FROM node:\${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

FROM node:\${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:\${NODE_VERSION}-alpine
ARG BUILD_ENV
ENV NODE_ENV=\${BUILD_ENV}
ENV PORT=3000
LABEL maintainer="platform@example.com"
LABEL version="1.0.0"
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000/tcp
VOLUME ["/app/data"]
USER app:app
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:3000/health || exit 1
ENTRYPOINT ["node"]
CMD ["dist/server.js"]
`;

/**
 * A 3-stage Dockerfile where the SECOND stage's FROM references the FIRST
 * stage BY NAME ("FROM builder AS test") and the third stage is a fresh
 * external image that then COPYs from the first stage.
 *
 * Hand-verified structure:
 *   - stage 0: name="builder", base="alpine:3.19", base_is_stage_ref=false
 *   - stage 1: name="test", base="builder", base_is_stage_ref=true, base_stage_index=0
 *   - stage 2: name="" (unnamed), base="alpine:3.19", base_is_stage_ref=false
 *   - ResolveStageBaseImage("test") walks test -> builder -> external
 *     "alpine:3.19", resolution_chain=["test","builder"]
 */
export const STAGE_REF_DOCKERFILE = `FROM alpine:3.19 AS builder
RUN echo building

FROM builder AS test
RUN echo testing

FROM alpine:3.19
COPY --from=builder /out /out
CMD ["/out/app"]
`;

/** A single-stage Dockerfile with no AS alias — the simplest valid case. */
export const SIMPLE_DOCKERFILE = `FROM alpine:3.19
RUN echo hi
CMD echo done
`;

/** Structurally invalid: RUN before any FROM, plus an unrecognized keyword. */
export const INVALID_DOCKERFILE = `RUN echo too-early
BOGUSCMD something
FROM alpine
`;

/** A Dockerfile whose sole HEALTHCHECK explicitly disables any inherited one. */
export const HEALTHCHECK_NONE_DOCKERFILE = `FROM alpine
HEALTHCHECK NONE
CMD echo ok
`;
