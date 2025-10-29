FROM oven/bun:1.1.13

WORKDIR /app

COPY package.json bun.lock ./

COPY packages/db/package.json ./packages/db/package.json
COPY apps/backend/package.json ./apps/backend/package.json

RUN bun install --production

COPY packages ./packages
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

EXPOSE 8080

CMD ["bun", "index.ts"]


