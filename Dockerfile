FROM node:16 as BUILD
WORKDIR /app
COPY ./package.json ./package.json
RUN npm i

COPY ./src ./src
COPY ./public ./public
COPY .env .env
RUN npm run build

FROM nginx
COPY --from=Build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]