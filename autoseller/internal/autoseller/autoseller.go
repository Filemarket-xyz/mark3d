package autoseller

import (
	"context"
	"crypto/ecdsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/filemarket-xyz/file-market/autoseller/contracts/filebunniesCollection"
	"github.com/filemarket-xyz/file-market/autoseller/pkg/csv"
	"github.com/filemarket-xyz/file-market/autoseller/pkg/rsa"
	"github.com/go-redis/redis/v8"
	"io"
	"log"
	"math/big"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

const (
	defaultIndexerAddr = "http://localhost:8000"
	defaultInterval    = 180 // Default time interval in seconds
	defaultTimeout     = 3600
)

type AutosellTokenInfo struct {
	TokenId   string
	MetaUri   string
	PublicKey string
}

type Config struct {
	IndexerAddr        string
	ApiKey             string
	Interval           time.Duration
	FinalizeTimeout    time.Duration
	RpcUri             string
	ChainId            *big.Int
	PrivateKey         *ecdsa.PrivateKey
	FileBunniesAddress common.Address
}

type Autoseller struct {
	Cfg         *Config
	redisClient *redis.Client
	ethClient   *ethclient.Client
	auth        *bind.TransactOpts
	instance    *filebunniesCollection.FileBunniesCollection

	nonce   uint64
	nonceMu sync.Mutex
}

func New() *Autoseller {
	cfg := loadConfig()
	rdb := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDRESS"),
		Password: os.Getenv("REDIS_PASSWORD"),
	})
	rpcClient, err := rpc.DialContext(context.Background(), cfg.RpcUri)
	if err != nil {
		log.Fatal("failed to create rpc client")
	}
	ethClient := ethclient.NewClient(rpcClient)

	auth, err := bind.NewKeyedTransactorWithChainID(cfg.PrivateKey, cfg.ChainId)
	if err != nil {
		log.Fatalf("failed to create Transactor: %v", err)
	}
	instance, err := filebunniesCollection.NewFileBunniesCollection(cfg.FileBunniesAddress, ethClient)
	if err != nil {
		log.Fatalf("failed to create instance: %v", err)
	}

	if err := loadKeys(context.Background(), rdb); err != nil {
		log.Fatal(err)
	}

	return &Autoseller{
		Cfg:         cfg,
		redisClient: rdb,
		ethClient:   ethClient,
		auth:        auth,
		instance:    instance,
	}
}

func (a *Autoseller) Process(ctx context.Context) (int, error) {
	addr := fmt.Sprintf("%s/tokens/file-bunnies/to_autosell?api-key=%s", a.Cfg.IndexerAddr, a.Cfg.ApiKey)
	res, err := http.DefaultClient.Get(addr)
	if err != nil {
		return 0, err
	}

	statusCode := res.StatusCode
	body, err := io.ReadAll(res.Body)
	if body != nil {
		res.Body.Close()
	}
	if err != nil {
		return 0, fmt.Errorf("failed to read body: %w", err)
	}
	if statusCode != 200 {
		return 0, fmt.Errorf("got status code: %d", statusCode)
	}

	var resp []AutosellTokenInfo
	if err := json.Unmarshal(body, &resp); err != nil {
		return 0, fmt.Errorf("failed to unmarshal body: %w", err)
	}

	if len(resp) <= 0 {
		return 0, nil
	}

	nonce, err := a.ethClient.PendingNonceAt(ctx, a.auth.From)
	if err != nil {
		return 0, fmt.Errorf("failed to get nonce: %w", err)
	}
	a.nonce = nonce

	var wg sync.WaitGroup
	// Rate limiting
	var ticker = time.NewTicker(time.Second)
	var limit = make(chan struct{}, 4)
	var processed atomic.Int32
	for _, r := range resp {
		<-ticker.C
		limit <- struct{}{}
		wg.Add(1)
		go func(tokenInfo AutosellTokenInfo) {
			defer func() { <-limit }()
			defer wg.Done()

			if err := a.approveSingleResponse(ctx, tokenInfo); err != nil {
				log.Printf("failed to process single response: %#v. Error: %v\n", tokenInfo, err)
				return
			}
			if err := a.addTimer(ctx, tokenInfo.TokenId); err != nil {
				log.Printf("failed to add timer for token_id: %s. Error: %v", tokenInfo.TokenId, err)
				return
			}

			log.Println("TokenId was processed: ", tokenInfo.TokenId)
			processed.Add(1)
		}(r)
	}
	wg.Wait()
	ticker.Stop()
	close(limit)

	return int(processed.Load()), nil
}

func (a *Autoseller) addTimer(ctx context.Context, tokenId string) error {
	key := fmt.Sprintf("autoseller.timer.%s", tokenId)
	timestamp := time.Now().Add(a.Cfg.FinalizeTimeout).Unix()
	if err := a.redisClient.Set(ctx, key, timestamp, 0).Err(); err != nil {
		return err
	}
	return nil
}

func (a *Autoseller) ProcessTimers(ctx context.Context) error {
	keyStr := fmt.Sprintf("autoseller.timer.*")
	keys, err := a.redisClient.Keys(ctx, keyStr).Result()
	if err != nil {
		return err
	}

	now := time.Now()
	nowUnix := now.Unix()

	if len(keys) <= 0 {
		return nil
	}
	nonce, err := a.ethClient.PendingNonceAt(context.Background(), a.auth.From)
	if err != nil {
		return fmt.Errorf("failed to get nonce: %w", err)
	}
	a.nonce = nonce

	var globalErr error
	var errMu sync.Mutex
	// Rate limiting
	var ticker = time.NewTicker(time.Second)
	var limit = make(chan struct{}, 4)
	var wg sync.WaitGroup
	for _, key := range keys {
		tokenIdStr, err := a.redisClient.Get(ctx, key).Result()
		if err != nil {
			globalErr = errors.Join(globalErr, fmt.Errorf("failed to get key: %s", key))
			continue
		}
		<-ticker.C
		limit <- struct{}{}
		wg.Add(1)
		go func(key string, tokenIdStr string) {
			<-ticker.C
			defer wg.Done()
			timestamp, _ := strconv.ParseInt(tokenIdStr, 10, 64)

			if timestamp < nowUnix {
				padding := len(keyStr) - 1
				tokenIdStr := key[padding:]
				tokenId, ok := big.NewInt(0).SetString(tokenIdStr, 10)
				if !ok {
					errMu.Lock()
					globalErr = errors.Join(globalErr, fmt.Errorf("failed to parse tokenId: %s", tokenIdStr))
					errMu.Unlock()
				}

				log.Println("Start finalizing token: ", tokenIdStr)

				if err := a.finalize(ctx, tokenId); err != nil {
					if strings.Contains(err.Error(), "transfer for this token wasn't created") {
						// token was already finalized
					} else {
						errMu.Lock()
						globalErr = errors.Join(globalErr, fmt.Errorf("failed to finalize tokenId: %s. Error: %v", tokenId.String(), err))
						errMu.Unlock()
						return
					}
				}

				if err := a.redisClient.Del(ctx, key).Err(); err != nil {
					errMu.Lock()
					globalErr = errors.Join(globalErr, fmt.Errorf("failed to delete key: %s. Error: %v", key, err))
					errMu.Unlock()
					return
				}

				log.Println("Processed timer: ", tokenId)
			}
		}(key, tokenIdStr)
	}
	wg.Wait()
	ticker.Stop()
	close(limit)

	if globalErr != nil {
		log.Println(globalErr)
	}

	return nil
}

func (a *Autoseller) approveSingleResponse(ctx context.Context, r AutosellTokenInfo) error {
	tokenId, ok := big.NewInt(0).SetString(r.TokenId, 10)
	if !ok {
		return errors.New("failed to parse tokenId")
	}
	pwd, err := getPassword(ctx, a.redisClient, r.MetaUri)
	if err != nil {
		return fmt.Errorf("failed to get password: %w", err)
	}
	publicKey, err := rsa.GetPublicKeyFromHex(r.PublicKey)
	if err != nil {
		return fmt.Errorf("failed to get public key: %w", err)
	}
	pwdBytes, err := base64.StdEncoding.DecodeString(pwd)
	if err != nil {
		return fmt.Errorf("failed to decrypt password: %w", err)
	}

	encryptedPwd, err := rsa.Encrypt(pwdBytes, publicKey, nil)
	if err != nil {
		return fmt.Errorf("failed to encrypt password: %w", err)
	}

	err = a.approve(ctx, tokenId, encryptedPwd)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			log.Println("failed to call approve", err)
			return nil
		}
		return fmt.Errorf("failed to call approve: %w", err)
	}

	return nil
}

func (a *Autoseller) finalize(ctx context.Context, tokenId *big.Int) error {
	ctx, cancel := context.WithTimeout(ctx, 180*time.Second)
	defer cancel()

	header, err := a.ethClient.HeaderByNumber(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to get header: %w", err)
	}
	priorityFee, err := a.getMaxPriorityFeePerGas(ctx)
	if err != nil {
		return fmt.Errorf("failed to get maxPriorityFee: %w", err)
	}

	a.nonceMu.Lock()
	nonce := a.nonce
	a.nonce++
	a.nonceMu.Unlock()

	session := &filebunniesCollection.FileBunniesCollectionSession{
		Contract: a.instance,
		TransactOpts: bind.TransactOpts{
			From:      a.auth.From,
			Signer:    a.auth.Signer,
			GasFeeCap: new(big.Int).Add(header.BaseFee, priorityFee),
			GasTipCap: priorityFee,
			Nonce:     new(big.Int).SetUint64(nonce),
		},
	}

	tx, err := session.FinalizeTransfer(tokenId)
	if err != nil {
		if strings.Contains(err.Error(), "encrypted password was already set") {
			log.Println("failed to call FinalizeTransfer: ", err)
			return nil
		}
		return fmt.Errorf("failed to call FanalizeTransfer: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, a.ethClient, tx)
	if err != nil {
		return fmt.Errorf("failed to get mined transaction: %w", err)
	}

	if receipt.Status != types.ReceiptStatusSuccessful {
		return fmt.Errorf("transaction was not successful, status code: %v", receipt.Status)
	}

	return nil
}

func (a *Autoseller) approve(ctx context.Context, tokenId *big.Int, password []byte) error {
	ctx, cancel := context.WithTimeout(ctx, 180*time.Second)
	defer cancel()

	header, err := a.ethClient.HeaderByNumber(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to get header: %w", err)
	}
	priorityFee, err := a.getMaxPriorityFeePerGas(ctx)
	if err != nil {
		return fmt.Errorf("failed to get maxPriorityFee: %w", err)
	}

	a.nonceMu.Lock()
	nonce := a.nonce
	a.nonce++
	a.nonceMu.Unlock()

	session := &filebunniesCollection.FileBunniesCollectionSession{
		Contract: a.instance,
		TransactOpts: bind.TransactOpts{
			From:      a.auth.From,
			Signer:    a.auth.Signer,
			GasFeeCap: new(big.Int).Add(header.BaseFee, priorityFee),
			GasTipCap: priorityFee,
			Nonce:     new(big.Int).SetUint64(nonce),
		},
	}

	tx, err := session.ApproveTransfer(tokenId, password)
	if err != nil {
		if strings.Contains(err.Error(), "failed to estimate gas") {
			log.Printf("failed to call ApproveTransfer (id: %s): %v\n", tokenId.String(), err)
			return nil
		}
		return fmt.Errorf("failed to call ApproveTransfer: %w", err)
	}

	receipt, err := bind.WaitMined(ctx, a.ethClient, tx)
	if err != nil {
		return fmt.Errorf("failed to mine transaction: %w", err)
	}

	if receipt.Status != types.ReceiptStatusSuccessful {
		return fmt.Errorf("transaction was not successful, status code: %v", receipt.Status)
	}

	return nil
}

func (a *Autoseller) getMaxPriorityFeePerGas(ctx context.Context) (*big.Int, error) {
	var feeStr string
	err := a.ethClient.Client().CallContext(ctx, &feeStr, "eth_maxPriorityFeePerGas")
	if err != nil {
		return nil, err
	}

	maxPriorityFeePerGas, ok := big.NewInt(0).SetString(feeStr[2:], 16)
	if !ok {
		return nil, errors.New("failed to parse bigint")
	}
	return maxPriorityFeePerGas, nil
}

func loadConfig() *Config {
	indexerAddr := os.Getenv("INDEXER_ADDR")
	if indexerAddr == "" {
		indexerAddr = defaultIndexerAddr
	}
	apiKey := os.Getenv("API_KEY")
	if apiKey == "" {
		log.Fatal("Error: empty api key")
	}
	intervalStr := os.Getenv("INTERVAL")
	if intervalStr == "" {
		intervalStr = strconv.Itoa(defaultInterval)
	}
	interval, err := strconv.ParseInt(intervalStr, 10, 64)
	if err != nil {
		log.Fatalf("Error parsing INTERVAL: %s", err)
	}
	timeoutStr := os.Getenv("FINALIZE_TIMEOUT")
	if intervalStr == "" {
		intervalStr = strconv.Itoa(defaultTimeout)
	}
	timeout, err := strconv.ParseInt(timeoutStr, 10, 64)
	if err != nil {
		log.Fatalf("Error parsing FINALIZE_TIMEOUT: %s", err)
	}
	rpcUri := os.Getenv("RPC")
	if rpcUri == "" {
		log.Fatal("Error: empty RPC uri")
	}
	privateKeyStr := os.Getenv("PRIVATE_KEY")
	if privateKeyStr == "" {
		log.Fatal("Error: empty private key")
	}
	privateKey, err := crypto.HexToECDSA(privateKeyStr)
	if err != nil {
		log.Fatalf("Failed to convert private key hex to ECDSA: %v", err)
	}
	chainIdStr := os.Getenv("CHAIN_ID")
	if chainIdStr == "" {
		log.Fatalf("Error: empty CHAIN_ID")
	}
	chainId, ok := big.NewInt(0).SetString(chainIdStr, 10)
	if !ok {
		log.Fatalf("Error parsing chain id")
	}
	fileBunniesAddressStr := os.Getenv("FILE_BUNNIES_ADDRESS")
	if fileBunniesAddressStr == "" {
		log.Fatal("Error: empty file bunnies address")
	}
	fileBunniesAddress := common.HexToAddress(fileBunniesAddressStr)

	return &Config{
		IndexerAddr:        indexerAddr,
		ApiKey:             apiKey,
		Interval:           time.Duration(interval) * time.Second,
		FinalizeTimeout:    time.Duration(timeout) * time.Second,
		RpcUri:             rpcUri,
		ChainId:            chainId,
		PrivateKey:         privateKey,
		FileBunniesAddress: fileBunniesAddress,
	}
}

func getPassword(ctx context.Context, rdb *redis.Client, metaUri string) (string, error) {
	pwd, err := rdb.Get(ctx, fmt.Sprintf("autoseller.keys.%s", metaUri)).Result()
	if err != nil {
		if err == redis.Nil {
			return "", errors.New("metaUri not exists")
		}
		return "", err
	}
	return pwd, nil
}

func loadKeys(ctx context.Context, rdb *redis.Client) error {
	keys, err := csv.ReadFromCsv("keys.csv")
	if err != nil {
		return fmt.Errorf("failed to load keys.csv: %w", err)
	}
	for _, key := range keys {
		err := rdb.SetNX(ctx, fmt.Sprintf("autoseller.keys.%s", key.Cid), key.Key, 0).Err()
		if err != nil && err != redis.Nil {
			return err
		}
	}
	return nil
}
