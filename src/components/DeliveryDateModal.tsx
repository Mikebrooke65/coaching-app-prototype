import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Team {
  id: string;
  name: string;
  age_group: string;
}

interface DeliveryDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (teamId: string, date: string) => void;
  userId: string;
  existingDelivery?: {
    teamId: string;
    date: string;
  };
}

export function DeliveryDateModal({ isOpen, onClose, onConfirm, userId, existingDelivery }: DeliveryDateModalProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState(existingDelivery?.teamId || '');
  const [deliveryDate, setDeliveryDate] = useState(existingDelivery?.date || new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserTeams();
      // Reset to existing delivery values if provided
      if (existingDelivery) {
        setSelectedTeamId(existingDelivery.teamId);
        setDeliveryDate(existingDelivery.date);
      }
      setIsSaving(false); // Reset saving state when modal opens
    }
  }, [isOpen, userId, existingDelivery]);

  const fetchUserTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, age_group')
        .eq('coach_id', userId)
        .order('age_group');

      if (error) throw error;
      setTeams(data || []);
      if (data && data.length > 0) {
        setSelectedTeamId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedTeamId || !deliveryDate) return;
    setIsSaving(true);
    try {
      await onConfirm(selectedTeamId, deliveryDate);
      // Parent will close modal, so we don't need to do anything here
    } catch (error) {
      console.error('Error in modal confirm:', error);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {existingDelivery ? 'Edit Delivery Date' : 'Mark Lesson as Delivered'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Team
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0091f3] focus:border-transparent"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.age_group} {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Date
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0091f3] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSaving || !selectedTeamId}
            className="flex-1 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
