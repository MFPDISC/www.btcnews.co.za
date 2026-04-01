# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install system dependencies for better-sqlite3
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    sqlite

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create data directory for SQLite database
RUN mkdir -p data

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy node_modules for runtime dependencies like better-sqlite3
COPY --from=builder /app/node_modules ./node_modules

# Create data directory and set permissions
RUN mkdir -p data
RUN chown nextjs:nodejs data

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
