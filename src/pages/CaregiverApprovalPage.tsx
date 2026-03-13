import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { caregiversApi } from '../lib/caregivers-api';
import type { CaregiverApproval } from '../types/database';

export function CaregiverApprovalPage() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<CaregiverApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) loadApprovals();
  }, [user?.id]);

  const loadApprovals = async () => {
    try {
      const data = await caregiversApi.getMyPendingApprovals(user!.id);
      setApprovals(data);
    } catch (e) {
      console.error('Failed to load approvals:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (approvalId: string, approved: boolean) => {
    setResponding(approvalId);
    try {
      await caregiversApi.respondToApproval(approvalId, approved, user!.id);
      setApprovals(prev => prev.filter(a => a.id !== approvalId));
    } catch (e) {
      console.error('Failed to respond:', e);
    } finally {
      setResponding(null);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Caregiver Approvals</h1>

      {approvals.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">✓</p>
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map(approval => (
            <div key={approval.id} className="bg-white rounded-lg shadow p-4">
              <p className="font-medium">
                {approval.new_caregiver_first_name} {approval.new_caregiver_last_name}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                {approval.new_caregiver_email} wants to be added as a caregiver
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespond(approval.id, true)}
                  disabled={responding === approval.id}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {responding === approval.id ? '...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleRespond(approval.id, false)}
                  disabled={responding === approval.id}
                  className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50">
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
