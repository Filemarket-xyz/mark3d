run:
	go run cmd/app/main.go -cfg configs/local

build-contracts:
	mkdir -p contracts/build
	(cd ../sol-contracts && yarn && yarn hardhat compile && cp -r artifacts/contracts/* ../indexer/contracts/build)
	mkdir -p contracts/access_token
	mkdir -p contracts/collection
	mkdir -p contracts/exchange
	jq ".abi" contracts/build/Mark3dAccessToken.sol/Mark3dAccessToken.json > contracts/build/Mark3dAccessToken.sol/Mark3dAccessToken.abi
	jq ".abi" contracts/build/Mark3dCollection.sol/Mark3dCollection.json > contracts/build/Mark3dCollection.sol/Mark3dCollection.abi
	jq ".abi" contracts/build/Mark3dExchange.sol/Mark3dExchange.json > contracts/build/Mark3dExchange.sol/Mark3dExchange.abi
	abigen --abi contracts/build/Mark3dAccessToken.sol/Mark3dAccessToken.abi \
		--pkg access_token \
		--type Mark3dAccessToken \
		--out contracts/access_token/access_token.go
	abigen --abi contracts/build/Mark3dCollection.sol/Mark3dCollection.abi \
        --pkg collection \
        --type Mark3dCollection \
        --out contracts/collection/collection.go
	abigen --abi contracts/build/Mark3dExchange.sol/Mark3dExchange.abi \
        --pkg exchange \
        --type Mark3dExchange \
        --out contracts/exchange/exchange.go

build-models:
	docker run --rm --user $(shell id -u):$(shell id -g) -e GOPATH=$(go env GOPATH):/go -v ${HOME}:${HOME} -w $(shell pwd) quay.io/goswagger/swagger generate model --spec=./swagger.yaml
	go mod tidy

postgres.start:
	if [ ! "$(shell docker ps -q -f name=test-postgres)" ]; then \
        if [ "$(shell docker ps -aq -f status=exited -f name=test-postgres)" ]; then \
            docker rm test-postgres; \
        fi; \
		docker run --restart unless-stopped -d -p 1338:5432 -e POSTGRES_PASSWORD=1337 --name test-postgres postgres:13 ;\
        sleep 5s; \
    fi;
	-docker exec test-postgres psql -U postgres -c "create user indexer password '1337'"
	-docker exec test-postgres psql -U postgres -c "create database mark3d_indexer"
	-docker exec test-postgres psql -U postgres -c "grant all privileges on database mark3d_indexer to indexer"

migrate.up:
	goose -dir migrations postgres "host=localhost port=1338 user=indexer password=1337 dbname=mark3d_indexer sslmode=disable" up

migrate.down:
	goose -dir migrations postgres "host=localhost port=1338 user=indexer password=1337 dbname=mark3d_indexer sslmode=disable" down

migrate.status:
	goose -dir migrations  postgres "host=localhost port=1338 user=indexer password=1337 dbname=mark3d_indexer sslmode=disable" status

swagger.start:
	cp swagger.yaml swagger.local.yaml
	sed -i "s/mark3d.xyz/localhost:9202/g" swagger.local.yaml
	sed -i "s/https/http/g" swagger.local.yaml
	docker run --restart unless-stopped -d --name mark3d-indexer-swagger -p 9201:8080 -e SWAGGER_JSON=/swagger.local.yaml -v $(shell pwd)/swagger.local.yaml:/swagger.local.yaml swaggerapi/swagger-ui

swagger.stop:
	docker stop mark3d-indexer-swagger
	docker rm mark3d-indexer-swagger