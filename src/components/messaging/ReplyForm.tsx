import { useState } from 'react';
import { Send, User, Users } from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import type { MessageRecipient } from '../../types/database';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ReplyFormProps {
  parentMessageId: string;
  recipient: MessageRecipient;
  onSent?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TARGETING_LABELS: Record<string, string> = {
  individual: 'Individual',
  whole_team: 'Whole Team',
  management_team: 'Management Team',
  club_admin: 'Club Admin',
};

// ---------------------------------------------------------------------------
// ReplyForm
// ---------------------------------------------------------------------------

export function ReplyForm({ parentMessageId, recipient, onSent }: ReplyFormProps) {
  const { sendReply } = useMessaging();

  const [body, setBody] = useState('');
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const targetLabel = TARGETING_LABELS[recipient.targeting_type] ?? recipient.targeting_type;
  const recipientCount = recipient.recipient_user_ids.length;
  const isIndividual = recipient.targeting_type === 'individual';

  function validate(): boolean {
    if (!body.trim()) {
      setBodyError('Message body is required');
      return false;
    }
    return true;
  }

  async function handleSend() {
    setSendError(null);
    if (!validate()) return;

    setIsSending(true);
    try {
      await sendReply(parentMessageId, { body: body.trim() });
      setBody('');
      setBodyError(null);
      onSent?.();
    } catch (err: any) {
      setSendError(err?.message || 'Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="border-t border-gray-200 px-4 py-3">
      {/* Recipient display */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        {isIndividual ? (
          <User className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        <span>
          {targetLabel} · {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Body textarea */}
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          if (bodyError) setBodyError(null);
          if (sendError) setSendError(null);
        }}
        placeholder="Write a reply…"
        rows={3}
        disabled={isSending}
        aria-label="Reply message body"
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none resize-y focus:ring-1 ${
          bodyError
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-200 focus:border-[#545859] focus:ring-[#545859]'
        }`}
      />
      {bodyError && (
        <p className="mt-1 text-sm text-red-600" role="alert">{bodyError}</p>
      )}

      {/* Send error */}
      {sendError && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
          {sendError}
        </div>
      )}

      {/* Send button */}
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || !body.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#545859' }}
        >
          <Send className="w-4 h-4" />
          {isSending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
