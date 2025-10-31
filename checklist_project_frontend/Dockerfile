FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ops/nginx.conf /etc/nginx/conf.d/default.conf

# SPA 라우팅 필요 시 사용자 정의 설정 사용 가능
# COPY ops/nginx.conf /etc/nginx/conf.d/default.conf