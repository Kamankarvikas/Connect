
import React from 'react';
import { Tab } from '../types';
import { NAV_ITEMS } from '../constants';
import { CloseIcon } from './Icons';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const handleNavClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <aside
      className={`w-64 flex-shrink-0 bg-white border-r border-stone-200 flex flex-col fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Sidebar"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200">
        <div className="text-2xl font-bold text-stone-800 tracking-tight">
            <span className="text-emerald-600">Agro</span><span className="text-amber-500">BEET</span> Connect
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 rounded-full text-stone-500 hover:bg-stone-100"
          aria-label="Close sidebar"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.id);
            }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab === item.id
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span className="w-6 h-6 mr-3">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-stone-200">
        <div className="p-4 rounded-lg bg-emerald-50 text-center">
          <h3 className="font-bold text-emerald-800">Need Help?</h3>
          <p className="text-xs text-emerald-700 mt-1">Check our FAQs or contact support.</p>
          <button className="mt-3 w-full text-sm bg-emerald-600 text-white py-1.5 rounded-md hover:bg-emerald-700 transition-colors">Contact Us</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;