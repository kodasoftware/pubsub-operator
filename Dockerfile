FROM node:10.15.3-alpine

WORKDIR /opt/app

COPY src /opt/app/src
COPY config /opt/app/config
COPY package.json /opt/app
COPY package-lock.json /opt/app
RUN npm i

EXPOSE 8080

CMD ["npm", "start"]