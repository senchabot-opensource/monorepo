
# syntax=docker/dockerfile:1.7

# Stage 1: Install all dependencies (dev + prod) with caching
FROM node:22-alpine AS deps
# libc6-compat provides some glibc compatibility. Newer Alpine images may not include
# openssl1.1 in the default repos, so add the edge community repo and then install it.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package manifests first for better layer reuse
COPY package.json package-lock.json ./

# Mount npm cache to reuse downloads across builds
RUN --mount=type=cache,target=/root/.npm npm ci --force

# Stage 2: Build the application (inherits node_modules from deps)
FROM deps AS builder
WORKDIR /app

# Copy source code (excluding entries from .dockerignore)
COPY . .

# Generate Prisma client and compile Next.js app
RUN npx prisma generate
RUN npm run build

# Stage 3: Production runtime without standalone output
FROM node:22-alpine AS runner
# Add edge community repo so openssl1.1 can be installed on newer Alpine releases,
# then install runtime dependencies including openssl1.1 and dumb-init.
RUN apk add --no-cache libc6-compat openssl dumb-init \
	&& addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy manifests and install only production dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --force \
	&& npm cache clean --force

# Copy build artifacts and runtime assets
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema and generated client assets needed at runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]