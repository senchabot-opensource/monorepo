FROM node:18.16.0 AS builder

# set for base and all layer that inherit from it
ENV NODE_ENV production

WORKDIR /app
RUN npm install --global turbo
COPY . .
RUN turbo prune --scope=senchabot-discord-bot --docker


FROM node:18.14.2 AS runner
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json .
#COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install --global turbo
RUN npm install
#RUN npm ci
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo build

RUN ls -la .

ENV NODE_ENV production

RUN npm --workspace=senchabot-discord-bot run build

EXPOSE 8080

ENTRYPOINT ["npm", "run","--workspace=senchabot-discord-bot", "start"]
