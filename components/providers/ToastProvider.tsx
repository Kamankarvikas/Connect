import React, { createContext, useState, useCallback, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircleIcon, XCircleIcon, CloseIcon } from '../Icons';

type ToastType = 'success' | 'error';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const Toast: React.FC<{ message: string; type: ToastType; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-emerald-500" />,
    error: <XCircleIcon className="w-6 h-6 text-red-500" />,
  };

  const baseClasses = 'flex items-center w-full max-w-xs p-4 text-stone-600 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5';

  return (
    <div className={baseClasses}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button onClick={onDismiss} className="ml-auto -mx-1.5 -my-1.5 bg-white text-stone-400 hover:text-stone-900 rounded-lg focus:ring-2 focus:ring-stone-300 p-1.5 hover:bg-stone-100 inline-flex h-8 w-8">
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  const toastRoot = document.getElementById('toast-root');
  if (!toastRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-5 right-5 z-[100] space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>,
    toastRoot
  );
};


export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
