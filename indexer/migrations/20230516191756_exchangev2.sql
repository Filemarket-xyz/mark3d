-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.orders
    ADD COLUMN currency        CHAR(42),
    ADD COLUMN exchange_address CHAR(42);
UPDATE public.orders
    SET currency = '0x0000000000000000000000000000000000000000',
        exchange_address = '0x0000000000000000000000000000000000000000'
    WHERE currency IS NULL AND
          exchange_address IS NULL;
ALTER TABLE public.orders
    ALTER COLUMN currency SET NOT NULL,
    ALTER COLUMN exchange_address SET NOT NULL;

ALTER TABLE public.tokens
    ADD COLUMN royalty BIGINT NOT NULL DEFAULT 0;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.orders
    DROP COLUMN currency,
    DROP COLUMN exchange_address;

ALTER TABLE public.tokens
    DROP COLUMN royalty;
