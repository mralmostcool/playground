CREATE TABLE pre_sea_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE enrollment_status AS ENUM ('ENROLLED', 'COMPLETED', 'CANCELLED');

CREATE TABLE enrollment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pre_sea_course_id UUID NOT NULL REFERENCES pre_sea_courses(id),
    indos_master_id UUID NOT NULL REFERENCES indos_master(id),
    status enrollment_status NOT NULL DEFAULT 'ENROLLED',
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enrollment_pre_sea_course_id ON enrollment(pre_sea_course_id);
CREATE INDEX idx_enrollment_indos_master_id ON enrollment(indos_master_id);

-- prevents a student from having two ENROLLED rows for the same course
-- (re-enrollment allowed after CANCELLED/COMPLETED)
CREATE UNIQUE INDEX idx_enrollment_unique_active
ON enrollment(pre_sea_course_id, indos_master_id)
WHERE status = 'ENROLLED';

CREATE TRIGGER trg_pre_sea_courses_updated_at
BEFORE UPDATE ON pre_sea_courses
FOR EACH ROW EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_enrollment_updated_at
BEFORE UPDATE ON enrollment
FOR EACH ROW EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_pre_sea_courses_audit
AFTER INSERT OR UPDATE OR DELETE ON pre_sea_courses
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER trg_enrollment_audit
AFTER INSERT OR UPDATE OR DELETE ON enrollment
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();