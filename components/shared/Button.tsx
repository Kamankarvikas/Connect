import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', icon, loading = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400',
    outline: 'bg-transparent border border-stone-300 text-stone-700 hover:bg-stone-100 focus:ring-emerald-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} disabled={loading} {...props}>
      {loading && <Spinner className="mr-2 -ml-1 h-5 w-5" />}
      {!loading && icon && <span className="mr-2 -ml-1 h-5 w-5">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;