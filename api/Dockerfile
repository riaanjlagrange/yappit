FROM node:20-alpine

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates 

RUN rm -rf /var/lib/lists/*

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile

RUN pnpm run db:setup

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]
