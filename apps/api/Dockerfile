FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
RUN pnpm --filter @lafite/api build

FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --prod --filter @lafite/api...
COPY --from=build /app/apps/api/dist ./apps/api/dist
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]