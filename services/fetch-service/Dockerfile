FROM node:12.0-slim
COPY . .
RUN npm install
CMD [ "node", "--experimental-modules", "index.js" ]

# docker build -t manipulate .
# docker run --env-file ./.env -p 80:80 manipulate