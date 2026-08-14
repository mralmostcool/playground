CREATE TABLE vessel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imo VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    flag VARCHAR(64) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE berth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    berth_name VARCHAR(128) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE berth_allocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    berth_id UUID NOT NULL REFERENCES berth(id),
    vessel_id UUID NOT NULL REFERENCES vessel(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date)
);

CREATE TRIGGER trg_vessel_update_at
BEFORE UPDATE ON vessel
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_berth_update_at
BEFORE UPDATE ON berth
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_berth_allocation_update_at
BEFORE UPDATE ON berth_allocation
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

ALTER TABLE berth_allocation
ADD CONSTRAINT no_overlapping_berth_allocation
EXCLUDE USING gist (
    berth_id WITH =,
    tstzrange(start_date, end_date) WITH &&
);

CREATE TRIGGER trg_vessel_audit
AFTER INSERT OR UPDATE OR DELETE ON vessel
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER trg_berth_audit
AFTER INSERT OR UPDATE OR DELETE ON berth
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER trg_berth_allocation_audit
AFTER INSERT OR UPDATE OR DELETE ON berth_allocation
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();