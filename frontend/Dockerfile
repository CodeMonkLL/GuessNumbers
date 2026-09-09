FROM node:20-alpine

WORKDIR /guess-number

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
