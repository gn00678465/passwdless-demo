ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION}-slim as base

ENV WORKDIR=/app
WORKDIR $WORKDIR

RUN corepack enable

FROM base as builder

COPY --link . .

RUN pnpm install
RUN pnpm build

FROM base

# Set production environment
ENV NODE_ENV=production

COPY --from=builder /app /app
COPY --from=builder /app/apps/client/dist /app/apps/server/dist/public

WORKDIR /app/apps/server/dist

RUN rm -rf /app/apps/client
RUN npm install pm2 -g

VOLUME [ "/app/db" ]

EXPOSE 80
EXPOSE 443

CMD ["pm2-runtime", "index.mjs"]