FROM node:20-slim

WORKDIR /app

COPY package*.json ./

#  Debug logs here
RUN echo " Installing dependencies..." \
 && npm install \
 && echo " Installed node_modules"

COPY . .

EXPOSE 3000

CMD ["npm", "start"]




