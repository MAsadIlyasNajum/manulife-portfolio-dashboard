FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.17.0 --activate && apk add --no-cache python3 make g++

ENV PNPM_STORE_PATH=/pnpm/store
RUN pnpm config set store-dir /pnpm/store

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs ./libs

ENV PNPM_ENABLE_SCRIPTS=true

RUN pnpm i --frozen-lockfile --prefer-offline --fetch-timeout 600000

RUN pnpm exec prisma generate --schema apps/api/prisma/schema.prisma

RUN pnpm nx build api --configuration=production

FROM node:24-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache dumb-init && corepack enable && corepack prepare pnpm@10.17.0 --activate

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

COPY apps/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--", "/usr/local/bin/docker-entrypoint.sh"]