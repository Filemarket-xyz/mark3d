-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE public.metadata_trait_count(
    trait_type   VARCHAR(255) NOT NULL,
    value        VARCHAR(255) NOT NULL,
    count        BIGINT       NOT NULL DEFAULT 0,
    PRIMARY KEY (trait_type, value)
);

ALTER TABLE public.metadata_trait_count
    OWNER TO indexer;

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

CREATE TRIGGER trigger_update_metadata_trait_count
    AFTER INSERT OR UPDATE OR DELETE
    ON public.token_metadata_properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_metadata_trait_count();
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TRIGGER trigger_update_metadata_trait_count ON public.token_metadata_properties;
DROP FUNCTION public.update_metadata_trait_count();
DROP TABLE public.metadata_trait_count;