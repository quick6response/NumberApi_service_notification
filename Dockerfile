FROM node:20-alpine AS builder

RUN apk add git
RUN apk add openssh-client

ENV TZ=Europe/Moscow
ENV NODE_ENV=build

WORKDIR /home/node

COPY package.json ./
COPY pnpm-lock.yaml ./


RUN npm i -g pnpm
RUN --mount=type=ssh pnpm i

COPY --chown=node:node . .
RUN npm run build \ && pnpm prune --prod

RUN npm run sentry:sourcemaps


FROM node:20-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/.env .env
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/pnpm-lock.yaml ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["npm", "run", "start:prod"]