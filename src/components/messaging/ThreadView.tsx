import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, SmilePlus, User, Users } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import type { ThreadDetail, ReactionGroup, Message } from '../../types/database';
import { useMessaging } from '../../contexts/MessagingContext';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ThreadViewProps {
  threadDetail: ThreadDetail;
  currentUserId: string;
  onBack?: () => void;
  onReadCountClick?: (messageId: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd/MM/yyyy');
}

function ReactionChips({
  reactions,
  currentUserId,
  onToggle,
}: {
  reactions: ReactionGroup[];
  currentUserId: string;
  onToggle: (emoji: string) => void;
}) {
  if (reactions.length === 0) return null;
  return (
    <div className="flex items-center gap-1 flex-wrap mt-2">
      {reactions.map((r) => {
        const isOwn = r.user_ids.includes(currentUserId);
        return (
          <button
            key={r.emoji}
            onClick={() => onToggle(r.emoji)}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs transition-colors ${
              isOwn
                ? 'bg-blue-100 border border-blue-300'
                : 'bg-white/60 border border-transparent'
            }`}
          >
            {r.emoji} {r.count}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ThreadView
// ---------------------------------------------------------------------------

export function ThreadView({
  threadDetail,
  currentUserId,
  onBack,
  onReadCountClick,
}: ThreadViewProps) {
  const { markAsRead, toggleReaction, sendReply, selectThread } = useMessaging();
  const { thread, replies } = threadDetail;
  const { message, sender, recipient, read_count, total_recipients } = thread;

  const isIndividual = recipient.targeting_type === 'individual';
  const senderName = `${sender.first_name} ${sender.last_name}`;

  // Inline reply form state
  const [replyBody, setReplyBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Track which message ID we've already marked as read to avoid re-firing
  const markedReadRef = useRef<string | null>(null);

  // Mark as read on mount / when thread changes
  useEffect(() => {
    if (!thread.is_read && message.id !== markedReadRef.current) {
      markedReadRef.current = message.id;
      markAsRead(message.id);
    }
  }, [message.id, thread.is_read, markAsRead]);

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      selectThread(null);
    }
  };

  // Handle reply submission
  const handleSendReply = async () => {
    const trimmed = replyBody.trim();
    if (!trimmed) {
      setReplyError('Message body is required');
      return;
    }

    setIsSending(true);
    setReplyError(null);
    try {
      await sendReply(message.id, { body: trimmed });
      setReplyBody('');
    } catch {
      setReplyError('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Recipient display label
  const recipientLabel =
    recipient.targeting_type === 'individual'
      ? 'Individual'
      : recipient.targeting_type === 'whole_team'
        ? 'Whole Team'
        : recipient.targeting_type === 'management_team'
          ? 'Management Team'
          : 'Club Admin';

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-200"
        style={{ backgroundColor: 'rgba(84, 88, 89, 0.2)' }}
      >
        <button
          onClick={handleBack}
          className="p-1 rounded-full hover:bg-white/40 transition-colors text-gray-700"
          aria-label="Back to messages"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 truncate">{message.title}</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {isIndividual ? (
              <User className="w-3.5 h-3.5" aria-label="Individual message" />
            ) : (
              <Users className="w-3.5 h-3.5" aria-label="Group message" />
            )}
            <span>{recipientLabel}</span>
          </div>
        </div>
      </div>

      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Top-level message */}
        <div className="rounded-lg p-4 border border-gray-200" style={{ backgroundColor: 'rgba(84, 88, 89, 0.2)' }}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-900">{senderName}</span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatMessageDate(message.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.body}</p>

          {/* Read count */}
          <div className="flex items-center justify-end mt-3">
            <button
              onClick={() => onReadCountClick?.(message.id)}
              className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
              aria-label={`Read by ${read_count} of ${total_recipients}`}
            >
              {read_count}/{total_recipients} read
            </button>
          </div>

          {/* Reactions */}
          <ReactionChips
            reactions={thread.reactions}
            currentUserId={currentUserId}
            onToggle={(emoji) => toggleReaction(message.id, emoji)}
          />
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="ml-4 border-l-2 border-gray-300 pl-4 space-y-3">
            {replies.map((reply) => (
              <ReplyBubble
                key={reply.id}
                reply={reply}
                currentUserId={currentUserId}
                onToggleReaction={(emoji) => toggleReaction(reply.id, emoji)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inline reply form */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="text-xs text-gray-500 mb-2">
          Replying to {recipientLabel} · {recipient.recipient_user_ids.length} recipient
          {recipient.recipient_user_ids.length !== 1 ? 's' : ''}
        </div>
        <div className="flex gap-2">
          <textarea
            value={replyBody}
            onChange={(e) => {
              setReplyBody(e.target.value);
              if (replyError) setReplyError(null);
            }}
            placeholder="Write a reply…"
            rows={2}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isSending}
          />
          <button
            onClick={handleSendReply}
            disabled={isSending || !replyBody.trim()}
            className="self-end px-4 py-2 rounded-lg bg-[#545859] text-white text-sm font-medium hover:bg-[#3e4243] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? 'Sending…' : 'Send'}
          </button>
        </div>
        {replyError && (
          <p className="text-xs text-red-600 mt-1">{replyError}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reply bubble sub-component
// ---------------------------------------------------------------------------

function ReplyBubble({
  reply,
  currentUserId,
  onToggleReaction,
}: {
  reply: Message & { sender: { first_name: string; last_name: string }; reactions: ReactionGroup[] };
  currentUserId: string;
  onToggleReaction: (emoji: string) => void;
}) {
  const replySenderName = `${reply.sender.first_name} ${reply.sender.last_name}`;

  return (
    <div className="rounded-lg p-3 border border-gray-200 bg-white">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-gray-900">{replySenderName}</span>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formatMessageDate(reply.created_at)}
        </span>
      </div>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{reply.body}</p>
      <ReactionChips
        reactions={reply.reactions}
        currentUserId={currentUserId}
        onToggle={onToggleReaction}
      />
    </div>
  );
}
