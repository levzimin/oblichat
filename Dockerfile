FROM node:8.11
COPY ./code /code/

RUN cd /code && npm install

WORKDIR /code
ENTRYPOINT ["node", "index.js"]
