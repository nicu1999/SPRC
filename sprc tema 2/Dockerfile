FROM node:14-alpine
RUN mkdir -p /home/server
RUN npm install express
RUN npm install mongoose
COPY . /home/server
CMD ["node", "/home/server/tema2.js"]