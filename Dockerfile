FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /numberapi-vk-notification-production

COPY ["package.json", "./"]

RUN npm install pnpm -g --save
RUN pnpm ci


COPY . .

CMD [ "node", "dist/main.js" ]