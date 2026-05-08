FROM node:22-alpine

WORKDIR /app

COPY live-radio-backend/package*.json ./

RUN npm install

COPY live-radio-backend/ .

EXPOSE 3000

CMD ["npm", "start"]
