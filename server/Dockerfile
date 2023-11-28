FROM node:20.10.0-alpine as backend-builder

ENV WORKDIR=/app
WORKDIR $WORKDIR
COPY . $WORKDIR

RUN corepack enable

RUN pnpm install
RUN pnpm build

FROM node:20.10.0-alpine as backend-final

ENV WORKDIR=/app
WORKDIR $WORKDIR

COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/dist ./dist

COPY package.json .

RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "dist/index.mjs"]