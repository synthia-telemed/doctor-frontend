FROM node:16-alpine as builder
RUN npm i -g pnpm
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY ./ ./
RUN pnpm run export

FROM nginx:1.23
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80