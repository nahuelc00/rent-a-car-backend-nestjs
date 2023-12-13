FROM node:20.10

WORKDIR /api
COPY package.json .
RUN npm install

COPY . .

CMD npm run start