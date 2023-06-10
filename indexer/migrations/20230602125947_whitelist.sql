-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE IF NOT EXISTS public.file_bunnies_whitelist(
    address CHAR(42)     NOT NULL,
    rarity  VARCHAR(255) NOT NULL,
    PRIMARY KEY (address, rarity)
);

ALTER TABLE public.file_bunnies_whitelist
    OWNER TO indexer;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TABLE IF EXISTS public.file_bunnies_whitelist;