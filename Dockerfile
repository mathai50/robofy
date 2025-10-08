# Alternative: Use Debian slim for potentially fewer vulnerabilities
# FROM node:20-slim AS builder

FROM node:20 AS builder

WORKDIR /app

# Add non-root user for build process
RUN groupadd -g 1001 nodejs && useradd -m -u 1001 -g nodejs nextjs

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Upgrade npm to latest version
RUN npm install -g npm@latest

# Set npm registry to ensure reliable package downloads
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies with exact versions
RUN npm ci

# Copy source code with correct ownership
COPY --chown=nextjs:nodejs . .

# List contents to verify files are copied correctly
RUN ls -la src/components/ui/ && echo "=== Dialog component ===" && cat src/components/ui/Dialog.tsx | head -5

# Build the application with static export
RUN npm run build

FROM node:20 AS production

WORKDIR /app

# Add non-root user for production
RUN groupadd -g 1001 nodejs && useradd -m -u 1001 -g nodejs nextjs

# Install serve globally for static file serving
RUN npm install -g serve@latest

# Copy production dependencies from builder stage (already installed with correct versions)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built static application from builder with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/out ./out
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tailwind.config.js ./
COPY --from=builder /app/postcss.config.js ./

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check with security considerations
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the static file server
CMD ["serve", "out", "-l", "0.0.0.0:3000"]