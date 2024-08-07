FROM node:20-alpine AS builder
WORKDIR /app
COPY ./client/package*.json ./
RUN npm ci

ENV VITE_ENV=production
ENV VITE_PORT=
ENV VITE_API_URL=

LABEL org.opencontainers.image.authors='renefernandez@duck.com' \
      org.opencontainers.image.url='https://github.com/renefs/bocabitlabs/pkgs/container/cociplan-client' \
      org.opencontainers.image.source="https://github.com/bocabitlabs/cociplan" \
      org.opencontainers.image.vendor='Rene Fernandez' \
      org.opencontainers.image.licenses='GPL-3.0-or-later'


RUN ls -la
COPY ./client ./
RUN npm run build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]