CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE capabilities (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE roles_capabilities (
    role_id         BIGINT NOT NULL REFERENCES roles(id),
    capability_id   BIGINT NOT NULL REFERENCES capabilities(id),
    PRIMARY KEY (role_id, capability_id)
);

CREATE TABLE regions (
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE attachments (
    id              BIGSERIAL PRIMARY KEY,
    filename        VARCHAR(255) NOT NULL,
    saved_name      VARCHAR(255) NOT NULL UNIQUE,
    file_path       VARCHAR(1024) NOT NULL,
    content_type    VARCHAR(100) NOT NULL,
    extension       VARCHAR(50) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted         BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    uuid        UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role_id     BIGINT NOT NULL REFERENCES roles(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE business_information (
    id                      BIGSERIAL PRIMARY KEY,
    tax_id                  VARCHAR(50),
    address                 VARCHAR(255) NOT NULL,
    phone                   VARCHAR(30) NOT NULL,
    organic_cert_number     VARCHAR(100),
    certification_file_id   BIGINT UNIQUE REFERENCES attachments(id),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted                 BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at              TIMESTAMPTZ
);

CREATE TABLE producers (
    id                  BIGSERIAL PRIMARY KEY,
    uuid                UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    business_name       VARCHAR(200) NOT NULL,
    owner_firstname     VARCHAR(100) NOT NULL,
    owner_lastname      VARCHAR(100) NOT NULL,
    vat                 VARCHAR(20) UNIQUE,
    description         TEXT,
    region_id           BIGINT REFERENCES regions(id),
    user_id             BIGINT NOT NULL UNIQUE REFERENCES users(id),
    business_info_id    BIGINT UNIQUE REFERENCES business_information(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted             BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at          TIMESTAMPTZ
);

CREATE TABLE consumers (
    id              BIGSERIAL PRIMARY KEY,
    uuid            UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    firstname       VARCHAR(100) NOT NULL,
    lastname        VARCHAR(100) NOT NULL,
    address         VARCHAR(255) NOT NULL,
    phone           VARCHAR(30) NOT NULL,
    user_id         BIGINT NOT NULL UNIQUE REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted         BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    uuid            UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    honey_type      VARCHAR(50) NOT NULL,
    description     TEXT,
    price           NUMERIC(10, 2) NOT NULL,
    quantity_kg     NUMERIC(10, 2) NOT NULL,
    harvest_year    INTEGER NOT NULL,
    producer_id     BIGINT NOT NULL REFERENCES producers(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted         BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_producers_region ON producers(region_id);
CREATE INDEX idx_producers_deleted ON producers(deleted);
CREATE INDEX idx_products_producer ON products(producer_id);
CREATE INDEX idx_products_honey_type ON products(honey_type);
CREATE INDEX idx_products_deleted ON products(deleted);
