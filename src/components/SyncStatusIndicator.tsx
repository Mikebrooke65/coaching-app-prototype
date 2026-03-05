import { useAppStore } from '../stores/appStore';
import { useOfflineStore } from '../stores/offlineStore';

export function SyncStatusIndicator() {
  const { syncStatus, lastSyncTime, pendingChanges } = useAppStore();
  const { isOnline } = useOfflineStore();

  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500';
    switch (syncStatus) {
      case 'syncing':
        return 'bg-blue-500 animate-pulse';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Synced';
      case 'error':
        return 'Sync failed';
      default:
        return 'Idle';
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    const date = new Date(lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span>{getStatusText()}</span>
      </div>
      
      {lastSyncTime && (
        <span className="text-gray-400">• {formatLastSync()}</span>
      )}
      
      {pendingChanges > 0 && (
        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          {pendingChanges} pending
        </span>
      )}
    </div>
  );
}
