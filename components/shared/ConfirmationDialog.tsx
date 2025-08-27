import React from 'react';
import Button from './Button';
import { CloseIcon } from '../Icons';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-fade-in-up">
        <header className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
            <CloseIcon className="w-6 h-6 text-stone-600" />
          </button>
        </header>
        <div className="p-6">
          <p className="text-stone-600">{message}</p>
        </div>
        <footer className="flex justify-end p-4 bg-stone-50/80 space-x-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={onConfirm} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
            {confirmText}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
