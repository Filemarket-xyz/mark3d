-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.tokens
    ADD COLUMN mint_transaction_timestamp BIGINT;
UPDATE public.tokens
    SET mint_transaction_timestamp = -1
    WHERE mint_transaction_timestamp IS NULL;
ALTER TABLE public.tokens
    ALTER COLUMN mint_transaction_timestamp SET NOT NULL;

ALTER TABLE public.tokens
    ADD COLUMN mint_transaction_hash VARCHAR(255);
UPDATE public.tokens
    SET mint_transaction_hash = ''
    WHERE mint_transaction_hash IS NULL;
ALTER TABLE public.tokens
    ALTER COLUMN mint_transaction_hash SET NOT NULL;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.tokens
    DROP COLUMN mint_transaction_timestamp;
ALTER TABLE public.tokens
    DROP COLUMN mint_transaction_hash;
