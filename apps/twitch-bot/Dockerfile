FROM golang:1.20-alpine AS builder

WORKDIR /app
COPY . .

ARG SERVICE_NAME

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w" -o /app/bin ./apps/twitch-bot/cmd/main/*.go

FROM scratch AS prod
COPY --from=builder /app/bin bin

EXPOSE 8080

ENTRYPOINT ["./bin"]