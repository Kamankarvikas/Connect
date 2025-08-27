
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, MenuIcon, SettingsIcon, BuildingOfficeIcon, LogoutIcon } from './Icons';
import { Tab } from '../types';
import { TABS } from '../constants';

interface TopBarProps {
  onMenuClick: () => void;
  setActiveTab: (tab: Tab) => void;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, setActiveTab, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsProfileOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex-shrink-0 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 -ml-2 mr-2 rounded-full text-stone-500 hover:bg-stone-100"
          aria-label="Open sidebar"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-stone-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="p-2 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
          <BellIcon className="w-6 h-6" />
        </button>
        <div className="h-8 w-px bg-stone-200 hidden sm:block"></div>
        <div className="relative" ref={profileMenuRef}>
            <div 
                className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
                <img
                    src="https://picsum.photos/seed/farmer/40/40"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-emerald-200"
                />
                <div className="hidden sm:block">
                    <p className="font-semibold text-sm text-stone-800">J. Appleseed</p>
                    <p className="text-xs text-stone-500">Admin</p>
                </div>
                <div className="p-1 rounded-full text-stone-500 transition-colors hidden sm:block">
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-stone-200/80 overflow-hidden animate-fade-in-up z-50">
                    <div className="p-3 border-b border-stone-200">
                         <p className="font-semibold text-sm text-stone-800">J. Appleseed</p>
                         <p className="text-xs text-stone-500 truncate">john.appleseed@example.com</p>
                    </div>
                    <div className="py-2">
                        <ProfileMenuItem icon={<BuildingOfficeIcon />} label="Company Profile" onClick={() => handleMenuClick(TABS.COMPANY_PROFILE)} />
                    </div>
                    <div className="p-1 border-t border-stone-200">
                        <ProfileMenuItem icon={<LogoutIcon />} label="Logout" onClick={onLogout} isDanger={true}/>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

const ProfileMenuItem: React.FC<{icon: React.ReactNode; label: string; onClick: () => void; isDanger?: boolean}> = ({ icon, label, onClick, isDanger }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md mx-1 ${isDanger ? 'text-red-600 hover:bg-red-50' : 'text-stone-700 hover:bg-stone-100'}`}
    >
        <span className="w-5 h-5 mr-3">{icon}</span>
        {label}
    </button>
)

export default TopBar;
