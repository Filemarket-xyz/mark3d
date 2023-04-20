-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE public.token_metadata
(
    id          BIGSERIAL    NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    image       TEXT         NOT NULL,
    hidden_file TEXT         NOT NULL,
    category    TEXT         NOT NULL,
    subcategory TEXT         NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.token_metadata
    OWNER TO indexer;

CREATE TYPE public.property_type_enum AS ENUM ('attribute', 'ranking', 'stat');

CREATE TABLE public.token_metadata_properties (
    id            BIGSERIAL NOT NULL,
    metadata_id   BIGINT    NOT NULL,
    trait_type    TEXT      NOT NULL,
    display_type  TEXT      NOT NULL,
    value_type    TEXT      NOT NULL,
    property_type public.property_type_enum NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT token_metadata_properties_metadata_fkey
        FOREIGN KEY (metadata_id)
            REFERENCES public.token_metadata (id)
            ON DELETE CASCADE
);

ALTER TABLE public.token_metadata_properties
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

ALTER TABLE public.tokens ADD COLUMN metadata_id BIGINT;
ALTER TABLE public.tokens
    ADD FOREIGN KEY (metadata_id)
    REFERENCES public.token_metadata(id);

ALTER TABLE public.tokens DROP COLUMN name;
ALTER TABLE public.tokens DROP COLUMN description;
ALTER TABLE public.tokens DROP COLUMN image;
ALTER TABLE public.tokens DROP COLUMN hidden_file;
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.tokens
    DROP CONSTRAINT tokens_metadata_id_fkey;
ALTER TABLE public.tokens
    DROP COLUMN metadata_id;

DROP TABLE public.token_metadata_tags;
DROP TABLE public.token_metadata_properties;
DROP TABLE public.token_metadata;

DROP TYPE public.property_type_enum;

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
