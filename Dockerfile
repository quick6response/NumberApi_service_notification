FROM node:18-alpine

WORKDIR /numberapi-vk-notification-production

ENV NODE_ENV=production

COPY . .

RUN npm install pnpm -g --save

RUN --mount=type=ssh pnpm ci

RUN npm run build
RUN npm run sentry:sourcemaps

CMD ["npm", "run", "start:prod"]