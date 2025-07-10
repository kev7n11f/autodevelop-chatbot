FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app/client
RUN npm install && npm run build
WORKDIR /app
CMD ["node", "server.js"]
