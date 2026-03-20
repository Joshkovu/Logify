FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g pnpm
RUN pnpm add serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npx", "serve", "dist", "--single", "--listen", "3000"]
