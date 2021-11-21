FROM node:14-alpine AS vue-build
WORKDIR /app
COPY ./client/package.json ./
RUN npm install --force
COPY ./client/ .
RUN npm run build

FROM node:14-alpine AS server-build
WORKDIR /app/server
COPY ./server/package.json ./
RUN npm install
COPY ./server .
COPY --from=vue-build /app/dist ./../client-dist
EXPOSE 80
CMD ["node", "./src/index.js"]
