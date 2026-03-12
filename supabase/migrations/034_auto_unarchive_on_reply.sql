-- Migration 034: Auto-unarchive thread when a reply is added
-- Requirement 12.6: When a new reply is added to an archived thread,
-- automatically unarchive the thread for all users who had archived it.

-- Trigger function: on reply INSERT, delete all message_archives for the parent thread
CREATE OR REPLACE FUNCTION fn_auto_unarchive_on_reply()
RETURNS TRIGGER AS $$
BEGIN
  -- Only act on replies (messages with a parent_message_id)
  IF NEW.parent_message_id IS NOT NULL THEN
    DELETE FROM message_archives
    WHERE message_id = NEW.parent_message_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_auto_unarchive_on_reply
  AFTER INSERT ON messages
  FOR EACH ROW
  WHEN (NEW.parent_message_id IS NOT NULL)
  EXECUTE FUNCTION fn_auto_unarchive_on_reply();
