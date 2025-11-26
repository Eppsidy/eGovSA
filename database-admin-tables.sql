-- ============================================
-- eGovSA Admin Portal Database Tables
-- Run these SQL commands in your PostgreSQL database (Supabase)
-- ============================================

-- Table 1: Application Status History
-- Tracks all status changes for applications
-- ============================================
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(100),
    new_status VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_application_status_history FOREIGN KEY (application_id) 
        REFERENCES applications(id) ON DELETE CASCADE
);

-- Indexes for application_status_history
CREATE INDEX IF NOT EXISTS idx_status_history_app 
    ON application_status_history(application_id);

CREATE INDEX IF NOT EXISTS idx_status_history_changed 
    ON application_status_history(changed_at DESC);

COMMENT ON TABLE application_status_history IS 'Tracks all status changes for applications';
COMMENT ON COLUMN application_status_history.old_status IS 'Previous status before change';
COMMENT ON COLUMN application_status_history.new_status IS 'New status after change';
COMMENT ON COLUMN application_status_history.changed_at IS 'Timestamp when status was changed';
COMMENT ON COLUMN application_status_history.notes IS 'Optional notes about the status change';

-- ============================================
-- Table 2: Admin Actions (Audit Trail)
-- Tracks all administrative actions for audit purposes
-- ============================================
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(100) NOT NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_action_application FOREIGN KEY (application_id) 
        REFERENCES applications(id) ON DELETE SET NULL,
    CONSTRAINT fk_admin_action_user FOREIGN KEY (user_id) 
        REFERENCES profiles(id) ON DELETE SET NULL
);

-- Indexes for admin_actions
CREATE INDEX IF NOT EXISTS idx_admin_actions_timestamp 
    ON admin_actions(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_admin_actions_application 
    ON admin_actions(application_id);

CREATE INDEX IF NOT EXISTS idx_admin_actions_type 
    ON admin_actions(action_type);

CREATE INDEX IF NOT EXISTS idx_admin_actions_user 
    ON admin_actions(user_id);

COMMENT ON TABLE admin_actions IS 'Audit trail of all administrative actions';
COMMENT ON COLUMN admin_actions.action_type IS 'Type of action: APPROVE, REJECT, UPDATE_STATUS, VIEW_DETAILS, etc.';
COMMENT ON COLUMN admin_actions.application_id IS 'Application affected by the action (nullable)';
COMMENT ON COLUMN admin_actions.user_id IS 'User affected by the action (nullable)';
COMMENT ON COLUMN admin_actions.details IS 'JSON or text description of the action details';
COMMENT ON COLUMN admin_actions.timestamp IS 'When the action was performed';

-- ============================================
-- Verify Tables Created Successfully
-- ============================================
SELECT 
    table_name, 
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS table_size
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('application_status_history', 'admin_actions')
ORDER BY table_name;

-- ============================================
-- Example Usage
-- ============================================

-- Example: Insert status history record
-- INSERT INTO application_status_history (application_id, old_status, new_status, notes)
-- VALUES (
--     '123e4567-e89b-12d3-a456-426614174000',
--     'Under Review',
--     'Completed',
--     'Application meets all requirements'
-- );

-- Example: Insert admin action record
-- INSERT INTO admin_actions (action_type, application_id, user_id, details)
-- VALUES (
--     'APPROVE',
--     '123e4567-e89b-12d3-a456-426614174000',
--     '123e4567-e89b-12d3-a456-426614174001',
--     'Application ID045 approved by admin'
-- );

-- Example: Query application status history
-- SELECT * FROM application_status_history
-- WHERE application_id = '123e4567-e89b-12d3-a456-426614174000'
-- ORDER BY changed_at DESC;

-- Example: Query recent admin actions
-- SELECT * FROM admin_actions
-- ORDER BY timestamp DESC
-- LIMIT 10;

-- ============================================
-- Grant Permissions (if needed)
-- ============================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON application_status_history TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON admin_actions TO authenticated;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
