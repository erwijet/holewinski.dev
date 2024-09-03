FROM node:20
WORKDIR /workbench

RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]