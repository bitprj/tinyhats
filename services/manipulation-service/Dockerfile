FROM node:12

RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY . .
RUN npm install
RUN npm i canvas
RUN npm i @tensorflow/tfjs-core@1.7.0
RUN npm i @tensorflow/tfjs-node@1.7.0
CMD [ "node", "index.js" ]

# docker build -t manipulate .
# docker run --env-file ./.env -p 80:80 manipulate