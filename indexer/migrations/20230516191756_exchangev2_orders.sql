-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.orders
    ADD COLUMN currency        CHAR(42),
    ADD COLUMN exchange_address CHAR(42);
UPDATE public.orders
    SET currency = '0x0000000000000000000000000000000000000000',
        exchange_address = '0xfdd2ef676c5c5de3476ffcf6eeca86e4cb8499d4'
    WHERE currency IS NULL AND
          exchange_address IS NULL;
ALTER TABLE public.orders
    ALTER COLUMN currency SET NOT NULL,
    ALTER COLUMN exchange_address SET NOT NULL;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.orders
    DROP COLUMN currency,
    DROP COLUMN exchange_address;
