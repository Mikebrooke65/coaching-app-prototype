import { useState, useRef, useEffect } from 'react';

const EMOJI_SET = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '💪', '⚽', '🎉'];

export interface ReactionPickerProps {
  isOpen: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ isOpen, onSelect, onClose }: ReactionPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 flex-wrap"
      role="listbox"
      aria-label="Emoji reactions"
    >
      {EMOJI_SET.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-lg transition-colors"
          role="option"
          aria-label={emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
