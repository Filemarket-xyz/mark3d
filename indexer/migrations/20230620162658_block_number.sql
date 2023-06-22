-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.collections ADD COLUMN block_number BIGINT;
UPDATE public.collections SET block_number=1 WHERE block_number IS NULL;
ALTER TABLE public.collections ALTER COLUMN block_number SET NOT NULL;

ALTER TABLE public.orders ADD COLUMN block_number BIGINT;
UPDATE public.orders SET block_number=1 WHERE block_number IS NULL;
ALTER TABLE public.orders ALTER COLUMN block_number SET NOT NULL;

ALTER TABLE public.tokens ADD COLUMN block_number BIGINT;
UPDATE public.tokens SET block_number=1 WHERE block_number IS NULL;
ALTER TABLE public.tokens ALTER COLUMN block_number SET NOT NULL;

ALTER TABLE public.transfers ADD COLUMN block_number BIGINT;
UPDATE public.transfers SET block_number=1 WHERE block_number IS NULL;
ALTER TABLE public.transfers ALTER COLUMN block_number SET NOT NULL;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.collections DROP COLUMN block_number;
ALTER TABLE public.orders DROP COLUMN block_number;
ALTER TABLE public.tokens DROP COLUMN block_number;
ALTER TABLE public.transfers DROP COLUMN block_number;
