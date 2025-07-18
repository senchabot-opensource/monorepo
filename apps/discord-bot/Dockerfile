FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY . .

ARG SERVICE_NAME

# Install CA certificates and tzdata
RUN apk update && apk add --no-cache ca-certificates && update-ca-certificates && apk add --no-cache tzdata

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w" -o /app/bin ./apps/discord-bot/cmd/main/*.go

FROM scratch AS prod
COPY --from=builder /app/bin bin
# Copy CA certificates from the builder stage
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080

ENTRYPOINT ["./bin"]