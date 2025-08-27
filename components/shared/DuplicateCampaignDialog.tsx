import React, { useState } from 'react';
import Button from './Button';
import { CloseIcon, PlusIcon } from '../Icons';

interface DuplicateCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (count: number) => void;
  campaignName: string;
}

const DuplicateCampaignDialog: React.FC<DuplicateCampaignDialogProps> = ({ isOpen, onClose, onConfirm, campaignName }) => {
  const [count, setCount] = useState(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (count > 0) {
      onConfirm(count);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-fade-in-up">
        <header className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800">Duplicate Campaign</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
            <CloseIcon className="w-6 h-6 text-stone-600" />
          </button>
        </header>
        <div className="p-6 space-y-4">
          <p className="text-stone-600">
            How many copies of <span className="font-semibold text-stone-800">"{campaignName}"</span> would you like to create?
          </p>
          <div>
            <label htmlFor="copy-count" className="block text-sm font-medium text-stone-700 mb-1">Number of Copies</label>
            <div className="flex items-center justify-center">
                <Button variant="outline" className="p-2 rounded-r-none" onClick={() => setCount(c => Math.max(1, c - 1))}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </Button>
                <input
                  type="number"
                  id="copy-count"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-24 px-3 py-2 bg-white border-y border-x-0 border-stone-300 text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:z-10"
                />
                <Button variant="outline" className="p-2 rounded-l-none" onClick={() => setCount(c => c + 1)}>
                    <PlusIcon className="w-5 h-5"/>
                </Button>
            </div>
          </div>
        </div>
        <footer className="flex justify-end p-4 bg-stone-50/80 space-x-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={count < 1}>
            Duplicate
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default DuplicateCampaignDialog;