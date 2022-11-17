FROM rust:1.63 as build-deps

WORKDIR /usr/src/protoc
RUN apt-get -y update && apt-get -y install wget unzip

WORKDIR /usr/src/mark3d-oracle
COPY backend backend

WORKDIR /usr/src/mark3d-oracle/backend
RUN cargo build --release

WORKDIR /usr/src/mark3d-oracle/contracts
COPY sol-contracts/artifacts artifacts

FROM rust:1.63

RUN apt-get -y update && apt-get -y install ca-certificates gcc

WORKDIR /usr/src/app

COPY --from=build-deps /usr/src/mark3d-oracle/backend/target/release/backend main
COPY --from=build-deps /usr/src/mark3d-oracle/backend/.env .env
COPY --from=build-deps /usr/src/mark3d-oracle/contracts/artifacts/contracts/Mark3dCollection.sol/Mark3dCollection.json Mark3dCollection.json
COPY --from=build-deps /usr/src/mark3d-oracle/contracts/artifacts/contracts/FraudDeciderWeb2.sol/FraudDeciderWeb2.json FraudDeciderWeb2.json
COPY --from=build-deps /usr/src/mark3d-oracle/contracts/artifacts/contracts/Mark3dAccessToken.sol/Mark3dAccessToken.json Mark3dAccessToken.json
COPY --from=build-deps /usr/src/mark3d-oracle/backend/run.sh run.sh

ENV LOG_PATH=/logs/mark3d-oracle.log

ENTRYPOINT ["./run.sh"]