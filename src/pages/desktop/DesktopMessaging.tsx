import { useState, useCallback, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Plus,
  Archive,
  Inbox,
  Loader2,
  ArchiveRestore,
  MoreVertical,
} from 'lucide-react';
import { MessagingProvider, useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';
import { SearchBar } from '../../components/messaging/SearchBar';
import { MessageCard } from '../../components/messaging/MessageCard';
import { ThreadView } from '../../components/messaging/ThreadView';
import { ComposeForm } from '../../components/messaging/ComposeForm';
import { ReadDetailModal } from '../../components/messaging/ReadDetailModal';
import { ReactionPicker } from '../../components/messaging/ReactionPicker';
import type { Thread } from '../../types/database';

// ---------------------------------------------------------------------------
// Context menu component for archive action on desktop
// ---------------------------------------------------------------------------

interface ContextMenuState {
  x: number;
  y: number;
  threadId: string;
  isArchived: boolean;
}

function ThreadContextMenu({
  state,
  onArchive,
  onUnarchive,
  onClose,
}: {
  state: ContextMenuState;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{ top: state.y, left: state.x }}
      role="menu"
    >
      {state.isArchived ? (
        <button
          onClick={() => {
            onUnarchive(state.threadId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          role="menuitem"
        >
          <ArchiveRestore className="w-4 h-4" />
          Unarchive
        </button>
      ) : (
        <button
          onClick={() => {
            onArchive(state.threadId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          role="menuitem"
        >
          <Archive className="w-4 h-4" />
          Archive
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner content (must be inside MessagingProvider)
// ---------------------------------------------------------------------------

type ViewMode = 'active' | 'archived';

function DesktopMessagingContent() {
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

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Hover state for archive button
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null);

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
    (messageId: string) => {
      archiveThread(messageId);
      // If the archived thread was selected, deselect it
      if (selectedThread?.thread.message.id === messageId) {
        selectThread(null);
      }
    },
    [archiveThread, selectedThread, selectThread],
  );

  const handleUnarchive = useCallback(
    (messageId: string) => {
      unarchiveThread(messageId);
    },
    [unarchiveThread],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, threadId: string, isArchived: boolean) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, threadId, isArchived });
    },
    [],
  );

  // Handle read count click from ThreadView (right panel)
  const handleThreadViewReadCountClick = useCallback(
    (msgId: string) => {
      if (selectedThread) {
        setReadModalMessageId(msgId);
        setReadModalRecipientIds(
          selectedThread.thread.recipient.recipient_user_ids,
        );
      }
    },
    [selectedThread],
  );

  return (
    <div className="h-full flex flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#545859]">Messaging</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#545859] text-white rounded-lg hover:bg-[#3e4243] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel — Thread list (1/3 width) */}
        <div className="w-1/3 flex flex-col bg-white rounded-lg shadow">
          {/* Search bar */}
          <div className="p-4 border-b border-gray-200">
            <SearchBar onSearch={handleSearch} placeholder="Search messages..." />
          </div>

          {/* Inbox / Archived toggle */}
          <div className="flex gap-2 px-4 py-3 border-b border-gray-200">
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

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}

            {!isLoading && displayThreads.length > 0 &&
              displayThreads.map((thread) => (
                <div
                  key={thread.message.id}
                  className="relative"
                  onContextMenu={(e) =>
                    handleContextMenu(
                      e,
                      thread.message.id,
                      viewMode === 'archived',
                    )
                  }
                  onMouseEnter={() => setHoveredThreadId(thread.message.id)}
                  onMouseLeave={() => setHoveredThreadId(null)}
                >
                  <div
                    className={`rounded-lg transition-all ${
                      selectedThread?.thread.message.id === thread.message.id
                        ? 'ring-2 ring-[#545859]'
                        : ''
                    }`}
                  >
                    <MessageCard
                      thread={thread}
                      currentUserId={currentUserId}
                      onClick={() => handleThreadClick(thread.message.id)}
                      onReadCountClick={() => handleReadCountClick(thread)}
                      onReactionClick={() =>
                        handleReactionClick(thread.message.id)
                      }
                      onArchive={() =>
                        viewMode === 'active'
                          ? handleArchive(thread.message.id)
                          : handleUnarchive(thread.message.id)
                      }
                    />
                  </div>

                  {/* Archive/unarchive button on hover */}
                  {hoveredThreadId === thread.message.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewMode === 'active'
                          ? handleArchive(thread.message.id)
                          : handleUnarchive(thread.message.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors z-10"
                      aria-label={
                        viewMode === 'active' ? 'Archive thread' : 'Unarchive thread'
                      }
                      title={viewMode === 'active' ? 'Archive' : 'Unarchive'}
                    >
                      {viewMode === 'active' ? (
                        <Archive className="w-3.5 h-3.5" />
                      ) : (
                        <ArchiveRestore className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* Reaction picker */}
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

            {!isLoading && displayThreads.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">
                  {searchQuery
                    ? 'No messages match your search'
                    : viewMode === 'archived'
                      ? 'No archived messages'
                      : 'No messages yet'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Thread detail (2/3 width) */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
          {selectedThread ? (
            <ThreadView
              threadDetail={selectedThread}
              currentUserId={currentUserId}
              onBack={() => selectThread(null)}
              onReadCountClick={handleThreadViewReadCountClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation to start messaging</p>
                <p className="text-sm mt-1">
                  Or click "New Message" to compose one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose form modal overlay */}
      {showCompose && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCompose(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <ComposeForm
              onClose={() => setShowCompose(false)}
              onSent={() => setShowCompose(false)}
              enableEnhancedTargeting={true}
            />
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <ThreadContextMenu
          state={contextMenu}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Read detail modal */}
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

export function DesktopMessaging() {
  return (
    <MessagingProvider>
      <DesktopMessagingContent />
    </MessagingProvider>
  );
}
