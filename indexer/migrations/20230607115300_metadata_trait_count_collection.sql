-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

ALTER TABLE public.token_metadata_properties
    ADD COLUMN collection_address CHAR(42) NOT NULL;

ALTER TABLE public.metadata_trait_count
    ADD COLUMN collection_address CHAR(42) NOT NULL;

ALTER TABLE public.metadata_trait_count
    DROP CONSTRAINT metadata_trait_count_pkey,
    ADD PRIMARY KEY (collection_address, trait_type, value);

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION public.update_metadata_trait_count()
    RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (NEW.trait_type != OLD.trait_type OR NEW.value != OLD.value OR NEW.property_type != OLD.property_type OR NEW.collection_address != OLD.collection_address)) THEN
        -- Incr `count` for the new (collection_address, trait_type, value)
        IF (NEW.property_type = 'property') THEN
            INSERT INTO public.metadata_trait_count (collection_address, trait_type, value, count)
            VALUES (NEW.collection_address, NEW.trait_type, NEW.value, 1)
            ON CONFLICT (collection_address, trait_type, value)
                DO UPDATE SET count = metadata_trait_count.count + 1;
        END IF;

        -- If UPDATE, decr the count for the old collection_address, trait_type, and value
        IF (TG_OP = 'UPDATE' AND OLD.property_type = 'property') THEN
            UPDATE public.metadata_trait_count
            SET count = count - 1
            WHERE collection_address = OLD.collection_address AND trait_type = OLD.trait_type AND value = OLD.value;

            -- Remove if the count becomes 0
            DELETE FROM public.metadata_trait_count WHERE collection_address = OLD.collection_address AND trait_type = OLD.trait_type AND value = OLD.value AND count = 0;
        END IF;
    END IF;

    -- If a row is deleted, decr the count
    IF (TG_OP = 'DELETE' AND OLD.property_type = 'property') THEN
        UPDATE public.metadata_trait_count
        SET count = count - 1
        WHERE collection_address = OLD.collection_address AND trait_type = OLD.trait_type AND value = OLD.value;

        DELETE FROM public.metadata_trait_count WHERE collection_address = OLD.collection_address AND trait_type = OLD.trait_type AND value = OLD.value AND count = 0;
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.token_metadata_properties
    DROP COLUMN collection_address;

ALTER TABLE public.metadata_trait_count
    DROP COLUMN collection_address;

ALTER TABLE public.metadata_trait_count
    DROP CONSTRAINT metadata_trait_count_pkey,
    ADD PRIMARY KEY (trait_type, value);

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION public.update_metadata_trait_count()
    RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (NEW.trait_type != OLD.trait_type OR NEW.value != OLD.value OR NEW.property_type != OLD.property_type)) THEN
        -- Incr `count` for the new (trait_type, value)
        IF (NEW.property_type = 'property') THEN
            INSERT INTO public.metadata_trait_count (trait_type, value, count)
            VALUES (NEW.trait_type, NEW.value, 1)
            ON CONFLICT (trait_type, value)
                DO UPDATE SET count = metadata_trait_count.count + 1;
        END IF;

        -- If UPDATE, decr the count for the old trait_type and value
        IF (TG_OP = 'UPDATE' AND OLD.property_type = 'property') THEN
            UPDATE public.metadata_trait_count
            SET count = count - 1
            WHERE trait_type = OLD.trait_type AND value = OLD.value;

            -- Remove if the count becomes 0
            DELETE FROM public.metadata_trait_count WHERE trait_type = OLD.trait_type AND value = OLD.value AND count = 0;
        END IF;
    END IF;

    -- If a row is deleted, decr the count
    IF (TG_OP = 'DELETE' AND OLD.property_type = 'property') THEN
        UPDATE public.metadata_trait_count
        SET count = count - 1
        WHERE trait_type = OLD.trait_type AND value = OLD.value;

        DELETE FROM public.metadata_trait_count WHERE trait_type = OLD.trait_type AND value = OLD.value AND count = 0;
    END IF;

    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;
-- +goose StatementEnd

