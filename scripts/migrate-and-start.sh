#!/bin/bash

pnpm prisma:generate
pnpm prisma:push

cd /app/apps/server/dist

pm2-runtime index.mjs