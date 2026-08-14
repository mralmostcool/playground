CREATE TABLE rank_master(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL,
    level INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rank_master (name, level) VALUES
    ('Deck Cadet', 1),
    ('Ordinary Seaman', 2),
    ('Able Seaman', 3),
    ('Third Officer', 4),
    ('Second Officer', 5),
    ('Chief Officer', 6),
    ('Master', 7);

CREATE TABLE indos_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indos VARCHAR(7) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    rank_id UUID NOT NULL REFERENCES rank_master(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_indos_update_at
BEFORE UPDATE ON indos_master
FOR EACH ROW
EXECUTE FUNCTION set_update_at();

CREATE TRIGGER trg_indos_master_audit
AFTER INSERT OR UPDATE OR DELETE ON indos_master
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();