FROM node:18.18.2-alpine3.18 as frontend-builder


ENV WORKDIR=/app
WORKDIR $WORKDIR
COPY . $WORKDIR

RUN corepack enable

RUN pnpm install
RUN pnpm build

FROM devforth/spa-to-http:latest as frontend-final
COPY --from=frontend-builder /app/dist/ .

