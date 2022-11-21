-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.transfers
    ADD COLUMN public_key         TEXT NOT NULL,
    ADD COLUMN encrypted_password TEXT NOT NULL;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.transfers
    DROP COLUMN public_key,
    DROP COLUMN encrypted_password;