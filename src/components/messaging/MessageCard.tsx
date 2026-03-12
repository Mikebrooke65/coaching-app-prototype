import { User, Users, SmilePlus } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import type { Thread } from '../../types/database';

export interface MessageCardProps {
  thread: Thread;
  currentUserId: string;
  onClick?: () => void;
  onReadCountClick?: () => void;
  onReactionClick?: () => void;
  onArchive?: () => void;
}

function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'dd/MM/yyyy');
}

export function MessageCard({
  thread,
  onClick,
  onReadCountClick,
  onReactionClick,
}: MessageCardProps) {
  const { message, sender, recipient, read_count, total_recipients, is_read, reactions } = thread;
  const isIndividual = recipient.targeting_type === 'individual';
  const senderName = `${sender.first_name} ${sender.last_name}`;

  return (
    <div
      onClick={onClick}
      className="rounded-lg p-4 cursor-pointer transition-colors border border-gray-200"
      style={{ backgroundColor: 'rgba(84, 88, 89, 0.2)' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Type icon */}
        <div className="flex-shrink-0 mt-1 text-gray-600">
          {isIndividual ? (
            <User className="w-5 h-5" aria-label="Individual message" />
          ) : (
            <Users className="w-5 h-5" aria-label="Group message" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + date row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`truncate text-gray-900 ${is_read ? 'font-normal' : 'font-bold'}`}
            >
              {message.title}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
              {formatMessageDate(thread.last_activity)}
            </span>
          </div>

          {/* Body - truncated to 2 lines */}
          <p
            className="text-sm text-gray-600 mb-1"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {message.body}
          </p>

          {/* Sender + read count row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">{senderName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReadCountClick?.();
              }}
              className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
              aria-label={`Read by ${read_count} of ${total_recipients}`}
            >
              {read_count}/{total_recipients}
            </button>
          </div>

          {/* Reactions row */}
          {reactions.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mt-1">
              {reactions.map((reaction) => (
                <span
                  key={reaction.emoji}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/60 rounded-full text-xs"
                >
                  {reaction.emoji} {reaction.count}
                </span>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReactionClick?.();
                }}
                className="inline-flex items-center p-1 rounded-full hover:bg-white/60 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Add reaction"
              >
                <SmilePlus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reaction button when no reactions yet */}
          {reactions.length === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReactionClick?.();
              }}
              className="inline-flex items-center p-1 rounded-full hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors mt-1"
              aria-label="Add reaction"
            >
              <SmilePlus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
