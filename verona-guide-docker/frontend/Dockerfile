# Dockerfile per il Frontend (Next.js)

FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npx", "next", "start", "-p", "8080", "-H", "0.0.0.0"]
