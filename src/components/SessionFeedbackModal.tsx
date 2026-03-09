import { useState, useEffect } from 'react';

interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
  sessionDeliveryId: string | null;
  initialRating: number | null;
  initialFeedback: string | null;
  isLocked: boolean;
  onSave: (sessionDeliveryId: string, rating: number, feedback: string) => Promise<void>;
}

export function SessionFeedbackModal({
  isOpen,
  onClose,
  sessionTitle,
  sessionDeliveryId,
  initialRating,
  initialFeedback,
  isLocked,
  onSave,
}: SessionFeedbackModalProps) {
  const [rating, setRating] = useState<number>(initialRating ?? 0);
  const [feedback, setFeedback] = useState<string>(initialFeedback ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating ?? 0);
      setFeedback(initialFeedback ?? '');
      setIsSaving(false);
    }
  }, [isOpen, initialRating, initialFeedback]);

  const handleSave = async () => {
    if (!sessionDeliveryId) return;
    
    setIsSaving(true);
    
    try {
      await onSave(sessionDeliveryId, rating, feedback);
      onClose();
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const stars = [0, 1, 2, 3, 4, 5];
  const starLabels = ['Not Delivered', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{sessionTitle}</h2>
        <p className="text-sm text-gray-600 mb-4">Session Feedback</p>
        
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating: {starLabels[rating]}
          </label>
          <div className="flex gap-2 flex-wrap">
            {stars.map((value) => (
              <button
                key={value}
                onClick={() => !isLocked && setRating(value)}
                disabled={isLocked}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-100'
                }`}
              >
                <svg
                  className={`w-10 h-10 ${
                    rating >= value
                      ? 'fill-[#ea7800] text-[#ea7800]'
                      : 'fill-none text-gray-300'
                  }`}
                  stroke="currentColor"
                  strokeWidth={1}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span className="text-xs text-gray-600 mt-1">{value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments (optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isLocked}
            maxLength={500}
            rows={4}
            placeholder="Share your thoughts about this session..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0091f3] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <div className="text-xs text-gray-500 mt-1">
            {feedback.length}/500 characters
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isLocked ? 'Close' : 'Cancel'}
          </button>
          {!isLocked && (
            <button
              onClick={handleSave}
              disabled={isSaving || !sessionDeliveryId}
              className="flex-1 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Feedback'}
            </button>
          )}
        </div>

        {isLocked && (
          <p className="text-sm text-gray-500 italic text-center mt-3">
            Feedback is locked and cannot be edited
          </p>
        )}
      </div>
    </div>
  );
}
