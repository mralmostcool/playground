CREATE TYPE contract_status AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'TERMINATED');

CREATE TABLE contract (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indos_master_id UUID NOT NULL REFERENCES indos_master(id),
    company_id UUID NOT NULL REFERENCES company(id),
    enrollment_id UUID NOT NULL REFERENCES enrollment(id),
    berth_seafarer_allocation_id UUID NOT NULL REFERENCES berth_seafarer_allocation(id),
    status contract_status NOT NULL DEFAULT 'DRAFT',

    -- planned sign on/off, drawn from the seafarer's slot within the berth's registered duration
    sign_on_date TIMESTAMPTZ NOT NULL,
    sign_on_port VARCHAR(128) NOT NULL,
    sign_on_country VARCHAR(128) NOT NULL,

    sign_off_date TIMESTAMPTZ NOT NULL,
    sign_off_port VARCHAR(128) NOT NULL,
    sign_off_country VARCHAR(128) NOT NULL,

    -- actual sign on/off, filled in as it happens; null until it does
    actual_sign_on_date TIMESTAMPTZ,
    actual_sign_on_port VARCHAR(128),
    actual_sign_on_country VARCHAR(128),

    actual_sign_off_date TIMESTAMPTZ,
    actual_sign_off_port VARCHAR(128),
    actual_sign_off_country VARCHAR(128),

    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (sign_off_date > sign_on_date),
    CHECK (actual_sign_off_date IS NULL OR actual_sign_on_date IS NULL OR actual_sign_off_date > actual_sign_on_date)
);

CREATE INDEX idx_contract_indos_master_id ON contract(indos_master_id);
CREATE INDEX idx_contract_company_id ON contract(company_id);
CREATE INDEX idx_contract_enrollment_id ON contract(enrollment_id);
CREATE INDEX idx_contract_berth_seafarer_allocation_id ON contract(berth_seafarer_allocation_id);

CREATE TRIGGER trg_contract_update_at
BEFORE UPDATE ON contract
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_contract_audit
AFTER INSERT OR UPDATE OR DELETE ON contract
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

-- a contract can only reference an enrollment that has been COMPLETED
CREATE OR REPLACE FUNCTION check_enrollment_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM enrollment
        WHERE id = NEW.enrollment_id AND status = 'COMPLETED'
    ) THEN
        RAISE EXCEPTION 'Contract requires a COMPLETED enrollment (enrollment_id: %)', NEW.enrollment_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contract_requires_completed_enrollment
BEFORE INSERT OR UPDATE ON contract
FOR EACH ROW EXECUTE FUNCTION check_enrollment_completed();