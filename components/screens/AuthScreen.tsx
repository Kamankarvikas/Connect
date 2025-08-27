
import React from 'react';
import Button from '../shared/Button';
import { GoogleIcon, ArrowLeftIcon } from '../Icons';

interface AuthScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack }) => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center relative p-4">
       <div className="absolute top-4 left-4">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Home
            </Button>
        </div>
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-stone-200/80 text-center">
            <div className="text-3xl font-bold text-stone-800 tracking-tight mb-4">
                <span className="text-emerald-600">Agro</span><span className="text-amber-500">BEET</span> Connect
            </div>
            <p className="text-stone-500 mb-8">Welcome back! Sign in to manage your campaigns.</p>
            
            <Button className="w-full py-3 text-base" onClick={onLogin} icon={<GoogleIcon className="w-6 h-6"/>}>
                Sign in with Google
            </Button>

            <p className="text-xs text-stone-400 mt-8">
                By signing in, you agree to our <a href="#" className="underline hover:text-emerald-600">Terms of Service</a> and <a href="#" className="underline hover:text-emerald-600">Privacy Policy</a>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;