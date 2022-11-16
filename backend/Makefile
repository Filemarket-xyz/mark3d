build-contracts:
	(yarn hardhat compile && cp -r artifacts/contracts/* ../indexer/contracts/build)

redis.start:
	docker run --name mark3d-backend-redis -p 9203:6379 -d redis redis-server --save 60 1

redis.stop:
	docker stop mark3d-backend-redis
	docker rm mark3d-backend-redis