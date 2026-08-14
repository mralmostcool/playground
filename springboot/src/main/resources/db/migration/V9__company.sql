CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(64) UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_company_update_at
BEFORE UPDATE ON company
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_company_audit
AFTER INSERT OR UPDATE OR DELETE ON company
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

ALTER TABLE vessel
ADD COLUMN company_id UUID REFERENCES company(id);

CREATE INDEX idx_vessel_company_id ON vessel(company_id);