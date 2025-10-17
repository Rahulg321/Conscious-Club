FROM oven/bun:1.1.13

# Build context: repository root. This Dockerfile assembles the monorepo pieces
# required for the backend so workspace deps like @repo/db are available.
WORKDIR /app

# First copy root manifests to set up workspaces and install deps
COPY package.json bun.lock ./

# Pre-copy package manifests to optimize install layer caching
COPY packages/db/package.json ./packages/db/package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install only production dependencies for all workspaces
RUN bun install --production

# Now copy actual source
COPY packages ./packages
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

EXPOSE 8080

CMD ["bun", "index.ts"]


