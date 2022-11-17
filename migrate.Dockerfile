FROM ubuntu:18.04

WORKDIR /usr/src/app
RUN apt -y update && apt install -y wget
RUN wget https://github.com/pressly/goose/releases/download/v3.4.1/goose_linux_x86_64
RUN chmod +x goose_linux_x86_64
COPY indexer/migrations .

ENTRYPOINT /usr/src/app/goose_linux_x86_64 postgres "host=indexer-postgres port=5432 user=$POSTGRES_USER password=$POSTGRES_PASSWORD dbname=$POSTGRES_DB sslmode=disable" up
