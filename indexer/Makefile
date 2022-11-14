run:
	go run cmd/app/main.go -cfg configs/local

build-models:
	docker run --rm -it  --user $(shell id -u):$(shell id -g) -e GOPATH=$(go env GOPATH):/go -v ${HOME}:${HOME} -w $(shell pwd) quay.io/goswagger/swagger generate model --spec=./swagger.yaml
	go mod tidy

migrate.up:
	goose -dir migrations postgres "host=localhost port=1338 user=indexer password=1337 dbname=mark3d_indexer sslmode=disable" up

migrate.down:
	goose -dir migrations postgres "host=localhost port=1338 user=indexer password=1337 dbname=mark3d_indexer sslmode=disable" down

migrate.status:
	goose -dir migrations  postgres "host=localhost port=1338 user=indexer password=1337 dbname=mark3d_indexer sslmode=disable" status