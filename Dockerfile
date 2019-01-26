FROM node:8-alpine
WORKDIR /usr/src/app
RUN apk update && apk upgrade && apk add --no-cache bash git openssh python g++ make
COPY . .
RUN rm -rf node_modules && npm install --only=production
EXPOSE 8080
CMD [ "npm", "start" ]