FROM node:16-alpine as builder
RUN npm i -g pnpm
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY ./ ./
RUN pnpm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000

ENV NODE_ENV production
EXPOSE 3000
CMD [ "node", "server.js" ]