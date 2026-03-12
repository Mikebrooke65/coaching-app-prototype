import { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle, Plus, Archive, Inbox, Loader2 } from 'lucide-react';
import { MessagingProvider, useMessaging } from '../contexts/MessagingContext';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from '../components/messaging/SearchBar';
import { MessageCard } from '../components/messaging/MessageCard';
import { ThreadView } from '../components/messaging/ThreadView';
import { ComposeForm } from '../components/messaging/ComposeForm';
import { ReadDetailModal } from '../components/messaging/ReadDetailModal';
import { ReactionPicker } from '../components/messaging/ReactionPicker';
import type { Thread } from '../types/database';

// ---------------------------------------------------------------------------
// Swipeable wrapper — detects left swipe on a MessageCard to trigger archive
// ---------------------------------------------------------------------------

function SwipeableCard({
  children,
  onSwipeLeft,
}: {
  children: React.ReactNode;
  onSwipeLeft: () => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const SWIPE_THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    touchCurrentX.current = Math.min(0, diff);
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${touchCurrentX.current}px)`;
      containerRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.2s ease-out';
      containerRef.current.style.transform = 'translateX(0)';
    }
    if (touchCurrentX.current < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    }
    touchStartX.current = null;
    touchCurrentX.current = 0;
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 bg-amber-500 rounded-lg w-full justify-end">
        <Archive className="w-5 h-5 text-white" />
      </div>
      <div
        ref={containerRef}
        className="relative bg-white rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pull-to-refresh hook
// ---------------------------------------------------------------------------

function usePullToRefresh(
  onRefresh: () => Promise<void>,
  scrollRef: React.RefObject<HTMLDivElement | null>,
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const PULL_THRESHOLD = 60;

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    },
    [scrollRef],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (touchStartY.current === null || isRefreshing) return;
      const diff = e.touches[0].clientY - touchStartY.current;
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.5, 100));
      }
    },
    [isRefreshing],
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    touchStartY.current = null;
  }, [pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isRefreshing, pullDistance };
}

// ---------------------------------------------------------------------------
// Inner messaging content (must be inside MessagingProvider)
// ---------------------------------------------------------------------------

type ViewMode = 'active' | 'archived';

function MessagingContent() {
  const { user } = useAuth();
  const {
    threads,
    archivedThreads,
    selectedThread,
    isLoading,
    selectThread,
    archiveThread,
    unarchiveThread,
    toggleReaction,
    refreshThreads,
  } = useMessaging();

  const currentUserId = user?.id ?? '';

  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Read detail modal state
  const [readModalMessageId, setReadModalMessageId] = useState<string | null>(null);
  const [readModalRecipientIds, setReadModalRecipientIds] = useState<string[]>([]);

  // Reaction picker state
  const [reactionPickerThreadId, setReactionPickerThreadId] = useState<string | null>(null);

  // Pull-to-refresh
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isRefreshing, pullDistance } = usePullToRefresh(refreshThreads, scrollRef);

  // Filter threads by search query
  const filterThreads = useCallback(
    (threadList: Thread[]) => {
      if (!searchQuery) return threadList;
      const q = searchQuery.toLowerCase();
      return threadList.filter(
        (t) =>
          t.message.title.toLowerCase().includes(q) ||
          t.message.body.toLowerCase().includes(q) ||
          `${t.sender.first_name} ${t.sender.last_name}`.toLowerCase().includes(q),
      );
    },
    [searchQuery],
  );

  const displayThreads = filterThreads(
    viewMode === 'active' ? threads : archivedThreads,
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleThreadClick = useCallback(
    (messageId: string) => selectThread(messageId),
    [selectThread],
  );

  const handleReadCountClick = useCallback((thread: Thread) => {
    setReadModalMessageId(thread.message.id);
    setReadModalRecipientIds(thread.recipient.recipient_user_ids);
  }, []);

  const handleReactionClick = useCallback((threadId: string) => {
    setReactionPickerThreadId((prev) => (prev === threadId ? null : threadId));
  }, []);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      if (reactionPickerThreadId) {
        toggleReaction(reactionPickerThreadId, emoji);
        setReactionPickerThreadId(null);
      }
    },
    [reactionPickerThreadId, toggleReaction],
  );

  const handleArchive = useCallback(
    (messageId: string) => archiveThread(messageId),
    [archiveThread],
  );

  const handleUnarchive = useCallback(
    (messageId: string) => unarchiveThread(messageId),
    [unarchiveThread],
  );

  // ---- Thread detail view (full screen on mobile) ----
  if (selectedThread) {
    return (
      <div className="h-screen flex flex-col pb-20">
        <ThreadView
          threadDetail={selectedThread}
          currentUserId={currentUserId}
          onBack={() => selectThread(null)}
          onReadCountClick={(msgId) => {
            setReadModalMessageId(msgId);
            setReadModalRecipientIds(
              selectedThread.thread.recipient.recipient_user_ids,
            );
          }}
        />
        <ReadDetailModal
          messageId={readModalMessageId ?? ''}
          recipientUserIds={readModalRecipientIds}
          isOpen={readModalMessageId !== null}
          onClose={() => setReadModalMessageId(null)}
        />
      </div>
    );
  }

  // ---- Compose view (full screen on mobile) ----
  if (showCompose) {
    return (
      <div className="flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
        <ComposeForm
          onClose={() => setShowCompose(false)}
          onSent={() => setShowCompose(false)}
        />
      </div>
    );
  }

  // ---- Default list view ----
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-0">
        <div className="border-l-8 border-[#545859] pl-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        <div className="mb-3">
          <SearchBar onSearch={handleSearch} placeholder="Search messages..." />
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode('active')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'active'
                ? 'bg-[#545859] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Inbox
          </button>
          <button
            onClick={() => setViewMode('archived')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'archived'
                ? 'bg-[#545859] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Archive className="w-4 h-4" />
            Archived
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-20">
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="flex items-center justify-center py-2 transition-all"
            style={{ height: isRefreshing ? 40 : pullDistance }}
          >
            <Loader2
              className={`w-5 h-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        {!isLoading && displayThreads.length > 0 && (
          <div className="space-y-2">
            {displayThreads.map((thread) => (
              <div key={thread.message.id} className="relative">
                {viewMode === 'active' ? (
                  <SwipeableCard
                    onSwipeLeft={() => handleArchive(thread.message.id)}
                  >
                    <MessageCard
                      thread={thread}
                      currentUserId={currentUserId}
                      onClick={() => handleThreadClick(thread.message.id)}
                      onReadCountClick={() => handleReadCountClick(thread)}
                      onReactionClick={() =>
                        handleReactionClick(thread.message.id)
                      }
                      onArchive={() => handleArchive(thread.message.id)}
                    />
                  </SwipeableCard>
                ) : (
                  <div>
                    <MessageCard
                      thread={thread}
                      currentUserId={currentUserId}
                      onClick={() => handleThreadClick(thread.message.id)}
                      onReadCountClick={() => handleReadCountClick(thread)}
                      onReactionClick={() =>
                        handleReactionClick(thread.message.id)
                      }
                    />
                    <button
                      onClick={() => handleUnarchive(thread.message.id)}
                      className="mt-1 text-xs text-[#545859] hover:underline"
                    >
                      Unarchive
                    </button>
                  </div>
                )}

                {reactionPickerThreadId === thread.message.id && (
                  <div className="absolute bottom-0 left-4 z-20">
                    <ReactionPicker
                      isOpen
                      onSelect={handleEmojiSelect}
                      onClose={() => setReactionPickerThreadId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && displayThreads.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery
                ? 'No messages match your search'
                : viewMode === 'archived'
                  ? 'No archived messages'
                  : 'No messages yet'}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowCompose(true)}
        className="fixed bottom-32 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 z-10"
        style={{ backgroundColor: '#545859' }}
        aria-label="Compose new message"
      >
        <Plus className="w-6 h-6" />
      </button>

      <ReadDetailModal
        messageId={readModalMessageId ?? ''}
        recipientUserIds={readModalRecipientIds}
        isOpen={readModalMessageId !== null}
        onClose={() => setReadModalMessageId(null)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported page component — wraps content with MessagingProvider
// ---------------------------------------------------------------------------

export function Messaging() {
  return (
    <MessagingProvider>
      <MessagingContent />
    </MessagingProvider>
  );
}
