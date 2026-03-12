import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { messagingApi } from '../../lib/messaging-api';
import type { MessageReadReceipt } from '../../types/database';

interface ReadReceiptWithUser extends MessageReadReceipt {
  user?: { first_name: string; last_name: string };
}

interface RecipientEntry {
  userId: string;
  name: string;
  hasRead: boolean;
}

export interface ReadDetailModalProps {
  messageId: string;
  recipientUserIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function ReadDetailModal({
  messageId,
  recipientUserIds,
  isOpen,
  onClose,
}: ReadDetailModalProps) {
  const [recipients, setRecipients] = useState<RecipientEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setRecipients([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetchData() {
      try {
        // Fetch read receipts (includes joined user data)
        const receipts = (await messagingApi.getReadReceipts(messageId)) as ReadReceiptWithUser[];
        if (cancelled) return;

        const readUserIds = new Set(receipts.map((r) => r.user_id));

        // Build a map of user names from receipts
        const userNameMap = new Map<string, string>();
        for (const receipt of receipts) {
          if (receipt.user) {
            userNameMap.set(
              receipt.user_id,
              `${receipt.user.first_name} ${receipt.user.last_name}`
            );
          }
        }

        // Fetch names for recipients who haven't read (not in receipts)
        const missingIds = recipientUserIds.filter((id) => !userNameMap.has(id));
        if (missingIds.length > 0) {
          const { data: users } = await supabase
            .from('users')
            .select('id, first_name, last_name')
            .in('id', missingIds);

          if (!cancelled && users) {
            for (const u of users) {
              userNameMap.set(u.id, `${u.first_name} ${u.last_name}`);
            }
          }
        }

        if (cancelled) return;

        // Build recipient list
        const entries: RecipientEntry[] = recipientUserIds.map((id) => ({
          userId: id,
          name: userNameMap.get(id) || 'Unknown User',
          hasRead: readUserIds.has(id),
        }));

        // Sort: readers first, then non-readers
        entries.sort((a, b) => {
          if (a.hasRead === b.hasRead) return a.name.localeCompare(b.name);
          return a.hasRead ? -1 : 1;
        });

        setRecipients(entries);
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load read receipts');
          console.error('[ReadDetailModal] fetch error:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isOpen, messageId, recipientUserIds]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Read receipts"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Read Receipts</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <p className="text-sm text-gray-500 text-center py-4">Loading…</p>
          )}

          {error && (
            <p className="text-sm text-red-600 text-center py-4">{error}</p>
          )}

          {!loading && !error && recipients.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No recipients found</p>
          )}

          {!loading && !error && recipients.length > 0 && (
            <ul className="space-y-1" role="list">
              {recipients.map((recipient) => (
                <li
                  key={recipient.userId}
                  className={`px-3 py-2 rounded-md text-sm ${
                    recipient.hasRead
                      ? 'bg-green-100 text-green-900'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {recipient.name}
                  {recipient.hasRead && (
                    <span className="ml-2 text-xs text-green-600">Read</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
