FROM node:10.16.3
MAINTAINER scott.chen@sixonetech.com
WORKDIR /usr/src/app
COPY package* ./
RUN npm install
COPY . .
VOLUME ["/usr/src/app"]
EXPOSE 8080
CMD ["node","./index.js"]
