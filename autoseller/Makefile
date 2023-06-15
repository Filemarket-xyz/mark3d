run:
	env ${cat .env} go run cmd/app/main.go

build-contracts:
	mkdir -p contracts/build
	(cd ../sol-contracts && yarn && yarn hardhat compile && cp -r artifacts/contracts/* ../autoseller/contracts/build)
	mkdir -p contracts/filebunniesCollection
	jq ".abi" contracts/build/FileBunniesCollection.sol/FileBunniesCollection.json > contracts/build/FileBunniesCollection.sol/FileBunniesCollection.abi
	abigen --abi contracts/build/FileBunniesCollection.sol/FileBunniesCollection.abi \
        --pkg filebunniesCollection \
        --type FileBunniesCollection \
        --out contracts/filebunniesCollection/filebunniesCollection.go
