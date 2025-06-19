# Stage 1: Build
FROM node:23.11.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:23.11.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# THIS COPIES BUILT FILES FROM STAGE 1
COPY --from=builder /app/dist ./dist

# Optional for uploads/logs if created at runtime
COPY uploads ./uploads
COPY logs ./logs

EXPOSE 3000
CMD ["node", "dist/main"]
