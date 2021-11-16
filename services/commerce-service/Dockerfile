FROM node:lts-alpine as vue-build
WORKDIR /app
COPY ./client/package.json ./
RUN npm install --legacy-peer-deps
COPY ./client/ .
RUN npm run build

FROM node:lts-alpine AS server-build
WORKDIR /app/server
COPY ./server/package.json ./
RUN npm install --legacy-peer-deps
COPY ./server .
COPY --from=vue-build /app/dist ./../client-dist
EXPOSE 80
CMD ["node", "./src/index.js"]
