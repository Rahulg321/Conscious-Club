# syntax=docker/dockerfile:1.7

FROM oven/bun:1.2 AS base
WORKDIR /app

# Install root workspace deps to enable building the backend which depends on @repo/db
COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

WORKDIR /app/apps/backend

# Build the backend for production (bundles to ./dist)
RUN bun run build

FROM oven/bun:1.2 AS runtime
WORKDIR /app

# Copy built artifacts and necessary runtime files
COPY --from=base /app/apps/backend/dist ./dist
COPY --from=base /app/apps/backend/package.json ./package.json

# Expose Cloud Run port
ENV PORT=8080
EXPOSE 8080

# Default envs (override in Cloud Run)
ENV NODE_ENV=production

CMD ["bun", "run", "./dist/index.js"]


