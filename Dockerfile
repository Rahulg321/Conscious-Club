FROM oven/bun:1.1.13

WORKDIR /app

# Copy root package.json and bun.lock for workspace resolution
COPY package.json bun.lock* ./

# Copy workspace package files first for better layer caching
COPY packages/db/package.json ./packages/db/package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install dependencies (workspace dependencies will be resolved)
RUN bun install --frozen-lockfile

# Copy all source code
COPY packages ./packages
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

EXPOSE 8080

# Cloud Run sets PORT env var automatically, but set default
ENV PORT=8080

CMD ["bun", "run", "index.ts"]


