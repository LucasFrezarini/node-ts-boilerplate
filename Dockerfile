FROM node:12.19.0-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run coverage
RUN npm run build
RUN npm prune --production

FROM alpine:3.12 AS app

RUN apk update
RUN apk add --no-cache nodejs=~12

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist


CMD ["node", "dist/app.js"]
