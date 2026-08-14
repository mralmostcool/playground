-- prevents an enrollment from being moved off COMPLETED once a contract
-- already depends on it (a contract's validity requires a completed enrollment)
CREATE OR REPLACE FUNCTION check_no_contract_depends_on_enrollment()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'COMPLETED' AND NEW.status != 'COMPLETED' THEN
        IF EXISTS (
            SELECT 1 FROM contract
            WHERE enrollment_id = OLD.id
        ) THEN
            RAISE EXCEPTION 'Cannot change enrollment status: a contract already depends on this enrollment (enrollment_id: %)', OLD.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enrollment_locked_by_contract
BEFORE UPDATE ON enrollment
FOR EACH ROW EXECUTE FUNCTION check_no_contract_depends_on_enrollment();