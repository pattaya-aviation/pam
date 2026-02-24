-- Add permissions column to portal_users
-- This stores per-user access control as JSONB

ALTER TABLE portal_users
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT NULL;

-- Example permissions structure:
-- {
--   "vfc":      { "access": true,  "tabs": { "inbox": true, "cards": true, "board": false, "table": true, "calendar": true, "trash": false, "settings": false } },
--   "tax":      { "access": true,  "tabs": { "overview": true, "calculator": true, "ly01": false } },
--   "settings": { "access": false, "tabs": { "approval": false, "users": false, "theme": false, "general": false } }
-- }

-- NULL = full access (backward compatible, existing users keep access)
-- Set default full access for existing approved users
UPDATE portal_users
SET permissions = '{
    "vfc":      {"access": true, "tabs": {"inbox": true, "cards": true, "board": true, "table": true, "calendar": true, "trash": true, "settings": true}},
    "tax":      {"access": true, "tabs": {"overview": true, "calculator": true, "ly01": true}},
    "settings": {"access": true, "tabs": {"approval": true, "users": true, "theme": true, "general": true}}
}'::jsonb
WHERE status = 'approved' AND permissions IS NULL;
