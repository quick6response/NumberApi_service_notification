FROM node:20-alpine AS builder

RUN apk add git
RUN apk add openssh-client

ENV NODE_ENV=build

WORKDIR /home/node

COPY package*.json ./

RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

RUN --mount=type=ssh npm ci

COPY --chown=node:node . .
RUN npm run build \
                        && npm prune --omit=dev

RUN npm run sentry:sourcemaps


FROM node:20-alpine

ENV TZ=Europe/Moscow
ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/.env .env
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["npm", "run", "start:prod"]