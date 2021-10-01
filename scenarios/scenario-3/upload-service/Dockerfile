FROM node:12.0-slim
COPY . .
RUN npm install
CMD [ "node", "--experimental-modules", "index.js" ]

# docker build -t upload .
# docker run --env-file ./.env -p 80:80 upload