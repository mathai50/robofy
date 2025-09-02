# Build stage for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage for frontend
FROM node:20-alpine AS frontend-production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built application from builder
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/next.config.js ./
COPY --from=frontend-builder /app/package.json ./

# Production stage for backend
FROM python:3.10-slim AS backend-production

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Create a non-root user
RUN useradd -m -u 1000 appuser
USER appuser

# Multi-stage final image
FROM node:20-alpine

WORKDIR /app

# Install Python and backend dependencies
RUN apk add --no-cache python3 py3-pip postgresql-dev gcc musl-dev
COPY --from=backend-production /app/backend /app/backend
# Create and use virtual environment to avoid externally-managed-environment error
RUN python3 -m venv /app/venv && \
    . /app/venv/bin/activate && \
    cd backend && pip install --no-cache-dir -r requirements.txt

# Copy frontend production build
COPY --from=frontend-production /app /app

# Copy necessary files
COPY package*.json ./
COPY package-lock.json ./
COPY next.config.js ./
COPY public ./public
COPY src ./src
COPY .env.production ./

# Install production dependencies
RUN npm ci --production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]