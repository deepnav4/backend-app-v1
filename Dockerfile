# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Copy source code
COPY src ./src

# Generate Prisma Client and build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema first
COPY prisma ./prisma

# Install dependencies (includes @prisma/client)
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set default environment variable
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
