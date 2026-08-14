CREATE TABLE institute (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_institute_update_at
BEFORE UPDATE ON institute
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_institute_audit
AFTER INSERT OR UPDATE OR DELETE ON institute
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

ALTER TABLE pre_sea_courses
ADD COLUMN institute_id UUID REFERENCES institute(id);

CREATE INDEX idx_pre_sea_courses_institute_id ON pre_sea_courses(institute_id);