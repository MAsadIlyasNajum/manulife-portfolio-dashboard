FROM node:24-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL=/api
RUN corepack enable
RUN corepack prepare pnpm@10.17.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/web ./apps/web
COPY libs ./libs

ENV PNPM_ENABLE_SCRIPTS=true

ENV PNPM_STORE_PATH=/pnpm/store
RUN pnpm config set store-dir /pnpm/store


RUN pnpm i --frozen-lockfile --prefer-offline --fetch-timeout 600000

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN pnpm nx build web --configuration=production


FROM nginx:alpine
COPY --from=builder /app/dist/apps/web /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80