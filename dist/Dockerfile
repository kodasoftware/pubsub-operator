FROM node:10.17 AS build

WORKDIR /

COPY src/ src/
COPY tsconfig.base.json tsconfig.json package.json package-lock.json ./
RUN npm i
RUN npm run compile

FROM node:10.17-alpine AS runtime

WORKDIR /opt/app

COPY --from=build /build/* ./
COPY config/ config/
RUN npm i

CMD ["node", "index.js"]