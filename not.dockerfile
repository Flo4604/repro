# syntax=docker/dockerfile:1
#   docker build -t repro .

# --- Stage 1: install dependencies ---
FROM oven/bun:1.3.9-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# --- Stage 2: build ---
FROM deps AS builder

COPY . .

RUN bun run build

# --- Stage 3: production image ---
FROM node:24-alpine AS runner

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 hono

WORKDIR /app

COPY --from=builder --chown=hono:nodejs /app/dist/index.mjs ./dist/index.mjs

USER hono

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.mjs"]
