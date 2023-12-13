FROM node:20.10

WORKDIR /api
COPY package.json .
RUN npm install

COPY . .

RUN npm run build

CMD npm run start