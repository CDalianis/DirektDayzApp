CREATE TABLE product_quantity_changes (
    id                      BIGSERIAL PRIMARY KEY,
    product_id              BIGINT NOT NULL REFERENCES products(id),
    previous_quantity_kg    NUMERIC(10, 2) NOT NULL,
    new_quantity_kg         NUMERIC(10, 2) NOT NULL,
    reason                  VARCHAR(50) NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_quantity_changes_product ON product_quantity_changes(product_id);
