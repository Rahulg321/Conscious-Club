FROM oven/bun:1.2

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend

# Install dependencies
RUN bun install --frozen-lockfile

WORKDIR /app/apps/backend

# Build the backend
RUN bun run build

# Expose port
EXPOSE 8080

# Run the built backend
CMD ["bun", "run", "./dist/index.js"]


