CREATE TABLE berth_seafarer_allocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    berth_id UUID NOT NULL REFERENCES berth(id),
    indos_master_id UUID NOT NULL REFERENCES indos_master(id),
    berth_allocation_id UUID REFERENCES berth_allocation(id),  -- nullable, optional link
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date)
);

CREATE INDEX idx_berth_seafarer_allocation_berth_allocation_id
ON berth_seafarer_allocation(berth_allocation_id);

CREATE INDEX idx_berth_seafarer_allocation_indos_master_id
ON berth_seafarer_allocation(indos_master_id);

CREATE TRIGGER trg_berth_seafarer_allocation_update_at
BEFORE UPDATE ON berth_seafarer_allocation
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

ALTER TABLE berth_seafarer_allocation
ADD CONSTRAINT no_overlapping_berth_seafarer_allocation
EXCLUDE USING gist (
    berth_id WITH =,
    tstzrange(start_date, end_date) WITH &&
);

ALTER TABLE berth_seafarer_allocation
ADD CONSTRAINT no_overlapping_seafarer_assignment
EXCLUDE USING gist (
    indos_master_id WITH =,
    tstzrange(start_date, end_date) WITH &&
);

CREATE TRIGGER trg_berth_seafarer_allocation_audit
AFTER INSERT OR UPDATE OR DELETE ON berth_seafarer_allocation
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();