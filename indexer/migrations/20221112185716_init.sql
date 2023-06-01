-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE IF NOT EXISTS public.collections
(
    address     CHAR(42)     NOT NULL,
    creator     CHAR(42)     NOT NULL,
    owner       CHAR(42)     NOT NULL,
    name        VARCHAR(255) NOT NULL,
    token_id    VARCHAR(255) NOT NULL,
    meta_uri    TEXT         NOT NULL,
    description TEXT         NOT NULL,
    image       TEXT         NOT NULL,
    PRIMARY KEY (address)
);

ALTER TABLE public.collections
    OWNER TO indexer;

CREATE TABLE public.collection_transfers
(
    collection_address CHAR(42) NOT NULL,
    timestamp          BIGINT   NOT NULL,
    from_address       CHAR(42) NOT NULL,
    to_address         CHAR(42) NOT NULL,
    tx_id              CHAR(66) NOT NULL,
    PRIMARY KEY (collection_address, timestamp),
    CONSTRAINT collection_transfers_collection_fkey
        FOREIGN KEY (collection_address)
            REFERENCES public.collections (address)
            ON DELETE CASCADE
);

ALTER TABLE public.collection_transfers
    OWNER TO indexer;

CREATE TABLE public.tokens
(
    collection_address CHAR(42)     NOT NULL,
    token_id           VARCHAR(255) NOT NULL,
    owner              CHAR(42)     NOT NULL,
    meta_uri           TEXT         NOT NULL,
    name               VARCHAR(255) NOT NULL,
    description        TEXT         NOT NULL,
    image              TEXT         NOT NULL,
    hidden_file        TEXT         NOT NULL,
    creator            CHAR(42)     NOT NULL,
    PRIMARY KEY (collection_address, token_id),
    CONSTRAINT tokens_collection_fkey
        FOREIGN KEY (collection_address)
            REFERENCES public.collections (address)
            ON DELETE CASCADE
);

ALTER TABLE public.tokens
    OWNER TO indexer;

CREATE TABLE public.transfers
(
    id                 BIGSERIAL    NOT NULL,
    collection_address CHAR(42)     NOT NULL,
    token_id           VARCHAR(255) NOT NULL,
    from_address       CHAR(42)     NOT NULL,
    to_address         VARCHAR(42)  NOT NULL,
    fraud_approved     BOOLEAN      NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT transfers_token_fkey
        FOREIGN KEY (collection_address, token_id)
            REFERENCES public.tokens (collection_address, token_id)
            ON DELETE CASCADE
);

ALTER TABLE public.transfers
    OWNER TO indexer;

CREATE TABLE public.transfer_statuses
(
    transfer_id BIGINT       NOT NULL,
    timestamp   BIGINT       NOT NULL,
    status      VARCHAR(255) NOT NULL,
    tx_id       CHAR(66)     NOT NULL,
    PRIMARY KEY (transfer_id, timestamp),
    CONSTRAINT transfer_statuses_transfer_fkey
        FOREIGN KEY (transfer_id)
            REFERENCES public.transfers (id)
            ON DELETE CASCADE
);

ALTER TABLE public.transfer_statuses
    OWNER TO indexer;

CREATE TABLE public.orders
(
    id          BIGSERIAL    NOT NULL,
    transfer_id BIGINT       NOT NULL,
    price       VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT orders_transfer_fkey
        FOREIGN KEY (transfer_id)
            REFERENCES public.transfers (id)
            ON DELETE CASCADE
);

ALTER TABLE public.orders
    OWNER TO indexer;

CREATE TABLE public.order_statuses
(
    order_id  BIGINT       NOT NULL,
    timestamp BIGINT       NOT NULL,
    status    VARCHAR(255) NOT NULL,
    tx_id     CHAR(66)     NOT NULL,
    PRIMARY KEY (order_id, timestamp),
    CONSTRAINT order_statuses_order_fkey
        FOREIGN KEY (order_id)
            REFERENCES public.orders (id)
            ON DELETE CASCADE
);

ALTER TABLE public.order_statuses
    OWNER TO indexer;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TABLE public.order_statuses;
DROP TABLE public.transfer_statuses;
DROP TABLE public.orders;
DROP TABLE public.transfers;
DROP TABLE public.tokens;
DROP TABLE public.collection_transfers;
DROP TABLE public.collections;
