FROM node:16.13.0 as build

# App
WORKDIR /base
COPY package.json .
COPY yarn.lock .
COPY ./packages/react-app packages/react-app
COPY ./packages/anchor packages/anchor
RUN yarn install
RUN yarn react-app:build

# Webserver
FROM nginx:stable-alpine
COPY --from=build /base/packages/react-app/build /usr/share/nginx/html
COPY ./packages/react-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
