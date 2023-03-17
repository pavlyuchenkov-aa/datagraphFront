# Build React app
FROM node:14 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "test", "--", "--coverage", "--watchAll=false", "."]

