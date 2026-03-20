FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app
RUN pnpm add serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["pnpm", "serve", "dist", "--", "--single", "--listen", "3000"]
