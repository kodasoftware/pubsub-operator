FROM node:10.17 AS build

WORKDIR /

COPY src/ src/
COPY package.json package-lock.json ./
COPY package-lock.json /opt/app
RUN npm i

FROM node:10.17-alpine AS runtime

WORKDIR /opt/app

COPY --from=build build/* ./
COPY config/ config/

CMD ["node", "index.js"]