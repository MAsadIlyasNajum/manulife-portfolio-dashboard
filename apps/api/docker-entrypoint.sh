#!/bin/sh
set -eu

pnpm exec prisma db push --schema apps/api/prisma/schema.prisma
pnpm exec prisma db seed --schema apps/api/prisma/schema.prisma

exec node dist/apps/api/main.js