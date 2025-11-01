FROM oven/bun:1.1.13

WORKDIR /app

# Copy root package.json and bun.lock for workspace resolution
COPY package.json bun.lock* ./

# Copy workspace packages that are needed (db package)
COPY packages/db/package.json ./packages/db/
COPY packages/db/ ./packages/db/

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/

# Install dependencies (this will resolve workspace dependencies)
RUN bun install --frozen-lockfile

# Copy backend source code
COPY apps/backend/ ./apps/backend/

WORKDIR /app/apps/backend

EXPOSE 8080

# Use explicit PORT environment variable
ENV PORT=8080

CMD ["bun", "run", "index.ts"]