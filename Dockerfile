FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "./"]

RUN rm -rf node_modules
RUN npm install pnpm -g --save
RUN pnpm i --force
RUN pnpm add @nestjs/mapped-types


COPY . .

CMD [ "node", "dist/main.js" ]