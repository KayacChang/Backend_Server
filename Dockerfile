FROM node:10.16.3
MAINTAINER scott.chen@sixonetech.com
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
VOLUME ["/usr/src/app"]
EXPOSE 8080
CMD ["node","./index.js"]
