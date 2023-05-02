-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE public.token_metadata
(
    id                 BIGSERIAL    NOT NULL,
    collection_address CHAR(42)     NOT NULL,
    token_id           VARCHAR(255) NOT NULL,
    name               VARCHAR(255) NOT NULL,
    description        TEXT         NOT NULL,
    image              TEXT         NOT NULL,
    hidden_file        TEXT         NOT NULL,
    license            TEXT         NOT NULL,
    license_url        TEXT         NOT NULL,
    external_link      TEXT         NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT token_metadata_tokens_fkey
        FOREIGN KEY (collection_address, token_id)
            REFERENCES public.tokens (collection_address, token_id)
            ON DELETE CASCADE
);

ALTER TABLE public.token_metadata
    OWNER TO indexer;

CREATE TABLE public.hidden_file_metadata
(
    id          BIGSERIAL NOT NULL,
    metadata_id BIGINT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(255) NOT NULL,
    size        BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT hidden_file_metadata_token_metadata_fkey
        FOREIGN KEY (metadata_id)
            REFERENCES public.token_metadata (id)
            ON DELETE CASCADE
);

ALTER TABLE public.hidden_file_metadata
    OWNER TO indexer;


CREATE TYPE public.property_type_enum AS ENUM ('property', 'ranking', 'stat');

CREATE TABLE public.token_metadata_properties (
    id            BIGSERIAL   NOT NULL,
    metadata_id   BIGINT      NOT NULL,
    trait_type    TEXT        NOT NULL,
    display_type  TEXT        NOT NULL,
    value         TEXT        NOT NULL,
    max_value     VARCHAR(20) NOT NULL,
    min_value     VARCHAR(20) NOT NULL,
    property_type public.property_type_enum NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT token_metadata_properties_metadata_fkey
        FOREIGN KEY (metadata_id)
            REFERENCES public.token_metadata (id)
            ON DELETE CASCADE
);

ALTER TABLE public.token_metadata_properties
    OWNER TO indexer;

CREATE TABLE public.token_metadata_categories
(
    id BIGSERIAL NOT NULL,
    metadata_id BIGINT NOT NULL,
    category VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT token_metadata_categories_token_metadata
        FOREIGN KEY (metadata_id)
            REFERENCES public.token_metadata (id)
            ON DELETE CASCADE
);

ALTER TABLE public.token_metadata_categories
    OWNER TO indexer;

CREATE TABLE public.token_metadata_subcategories
(
    id BIGSERIAL NOT NULL,
    metadata_id BIGINT NOT NULL,
    subcategory VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT token_metadata_subcategories_token_metadata
        FOREIGN KEY (metadata_id)
            REFERENCES public.token_metadata (id)
            ON DELETE CASCADE
);

ALTER TABLE public.token_metadata_subcategories
    OWNER TO indexer;

CREATE TABLE public.token_metadata_tags (
  id BIGSERIAL NOT NULL,
  metadata_id BIGSERIAL NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT token_metadata_tags_metadata_fkey
      FOREIGN KEY (metadata_id)
          REFERENCES public.token_metadata (id)
          ON DELETE CASCADE
);

ALTER TABLE public.token_metadata_tags
    OWNER TO indexer;

ALTER TABLE public.tokens DROP COLUMN name;
ALTER TABLE public.tokens DROP COLUMN description;
ALTER TABLE public.tokens DROP COLUMN image;
ALTER TABLE public.tokens DROP COLUMN hidden_file;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TABLE public.hidden_file_metadata;
DROP TABLE public.token_metadata_tags;
DROP TABLE public.token_metadata_properties;
DROP TYPE public.property_type_enum;
DROP TABLE public.token_metadata_categories;
DROP TABLE public.token_metadata_subcategories;
DROP TABLE public.token_metadata;

ALTER TABLE public.tokens
    ADD COLUMN name VARCHAR(255);
UPDATE public.tokens
    SET name = ''
    WHERE name IS NULL;
ALTER TABLE public.tokens
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE public.tokens
    ADD COLUMN description TEXT;
UPDATE public.tokens
    SET description = ''
    WHERE description IS NULL;
ALTER TABLE public.tokens
    ALTER COLUMN description SET NOT NULL;

ALTER TABLE public.tokens
    ADD COLUMN image TEXT;
UPDATE public.tokens
    SET image = ''
    WHERE image IS NULL;
ALTER TABLE public.tokens
    ALTER COLUMN image SET NOT NULL;

ALTER TABLE public.tokens
    ADD COLUMN hidden_file TEXT;
UPDATE public.tokens
    SET hidden_file = ''
    WHERE hidden_file IS NULL;
ALTER TABLE public.tokens
    ALTER COLUMN hidden_file SET NOT NULL;
