FROM --platform=$TARGETPLATFORM node:22-alpine AS build

ENV NODE_ENV production
WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache libc6-compat yarn npm

# Copy package files
COPY --chown=node:node package.json yarn.lock ./

# Install all dependencies with cache
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

# Copy source code
COPY --chown=node:node . .

# Generate Prisma client
RUN yarn db:generate:ci

# Build application
RUN yarn build:ci

FROM --platform=$TARGETPLATFORM node:22-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy package files
COPY --chown=nestjs:nodejs package.json yarn.lock ./

# Install production dependencies and prisma globally
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --production && \
    yarn cache clean && \
    yarn global add prisma && \
    mkdir -p /app/node_modules/.prisma && \
    mkdir -p /app/node_modules/prisma && \
    chown -R nestjs:nodejs /app/node_modules/.prisma && \
    chown -R nestjs:nodejs /app/node_modules/prisma

# Copy built files
COPY --chown=nestjs:nodejs --from=build /usr/src/app/dist ./dist
COPY --chown=nestjs:nodejs --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prisma.config.ts ./
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

EXPOSE 80

CMD ["sh", "-c", "yarn db:push:ci && yarn start:prod"]
