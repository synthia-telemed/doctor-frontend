FROM node:16-alpine
RUN npm i -g pnpm
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY ./ ./
RUN pnpm run build
EXPOSE 3000
CMD [ "pnpm", "start" ]