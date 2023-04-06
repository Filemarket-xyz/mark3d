# Build stage
FROM golang:1.20-alpine AS build

WORKDIR /app
COPY . .
RUN go build -o main cmd/app/main.go

# Run stage
FROM alpine:3.17.3
WORKDIR /app
COPY --from=build /app/main .

EXPOSE 8080
CMD ["/app/main"]
