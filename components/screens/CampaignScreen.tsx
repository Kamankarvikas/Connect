import React, { useState, useRef, useEffect, useMemo } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, PencilIcon, DocumentDuplicateIcon, PlayIcon, PauseIcon, EyeIcon, TrashIcon, SearchIcon } from '../Icons';
import { Campaign, Tab } from '../../types';

interface CampaignScreenProps {
  setActiveTab: (tab: Tab) => void;
  campaigns: Campaign[];
  onCreate: () => void;
  onEdit: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onUpdate: (campaign: Campaign) => void;
  onViewDetails: (campaign: Campaign) => void;
}


const ActionsDropdown: React.FC<{ 
    campaign: Campaign; 
    onEdit: () => void; 
    onDuplicate: () => void; 
    onDelete: () => void;
    onUpdate: (campaign: Campaign) => void; 
    onViewDetails: () => void;
}> = ({ campaign, onEdit, onDuplicate, onDelete, onUpdate, onViewDetails }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleActionClick = (action: () => void) => {
        action();
        setIsOpen(false);
    }
    
    const handleStatusChange = (newStatus: Campaign['status']) => {
        onUpdate({ ...campaign, status: newStatus });
        setIsOpen(false);
    }

    const menuItems = [];

    menuItems.push({ label: 'View Details', icon: <EyeIcon className="w-4 h-4" />, action: () => handleActionClick(onViewDetails) });
    
    if (campaign.status === 'Draft' || campaign.status === 'Paused' || campaign.status === 'Scheduled') {
        menuItems.push({ label: 'Edit', icon: <PencilIcon className="w-4 h-4" />, action: () => handleActionClick(onEdit) });
    }
    if (campaign.status === 'Scheduled' || campaign.status === 'Running') {
        menuItems.push({ label: 'Pause', icon: <PauseIcon className="w-4 h-4" />, action: () => handleStatusChange('Paused') });
    }
    if (campaign.status === 'Paused') {
        menuItems.push({ label: 'Resume', icon: <PlayIcon className="w-4 h-4" />, action: () => handleStatusChange('Running') });
    }
    
    menuItems.push({ label: 'Duplicate', icon: <DocumentDuplicateIcon className="w-4 h-4" />, action: () => handleActionClick(onDuplicate) });
    menuItems.push({ label: 'Delete', icon: <TrashIcon className="w-4 h-4 text-red-600" />, action: () => handleActionClick(onDelete), isDanger: true });


    return (
        <div className="relative" ref={menuRef}>
            <Button variant="outline" className="py-1 px-2" onClick={() => setIsOpen(!isOpen)}>
                 <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-2xl border border-stone-200/80 overflow-hidden animate-fade-in-up z-10">
                    <div className="py-1">
                       {menuItems.map(item => (
                           <button 
                                key={item.label} 
                                onClick={item.action} 
                                className={`w-full text-left flex items-center px-3 py-2 text-sm ${item.isDanger ? 'text-red-700 hover:bg-red-50' : 'text-stone-700 hover:bg-stone-100'}`}
                            >
                               <span className="w-5 h-5 mr-2">{item.icon}</span>
                               {item.label}
                           </button>
                       ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const CampaignRow: React.FC<{ 
    campaign: Campaign; 
    onEdit: (campaign: Campaign) => void; 
    onDuplicate: (campaign: Campaign) => void; 
    onDelete: (campaign: Campaign) => void;
    onUpdate: (campaign: Campaign) => void;
    onViewDetails: (campaign: Campaign) => void;
}> = ({ campaign, onEdit, onDuplicate, onDelete, onUpdate, onViewDetails }) => {
    const statusClasses = {
        Draft: 'bg-stone-200 text-stone-800',
        Scheduled: 'bg-blue-100 text-blue-800',
        Running: 'bg-emerald-100 text-emerald-800 animate-pulse',
        Completed: 'bg-gray-100 text-gray-800',
        Paused: 'bg-amber-100 text-amber-800',
    };

    return (
        <tr className="border-b border-stone-200 hover:bg-stone-50/80 transition-colors">
            <td className="px-5 py-4 font-medium text-stone-800">{campaign.name}</td>
            <td className="px-5 py-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[campaign.status]}`}>
                    {campaign.status}
                </span>
            </td>
            <td className="px-5 py-4 text-stone-600">{campaign.channel}</td>
            <td className="px-5 py-4 text-stone-600">{campaign.startDate}</td>
            <td className="px-5 py-4 text-stone-600 text-right">{campaign.reach.toLocaleString()}</td>
            <td className="px-5 py-4 text-stone-600 text-right">{campaign.clicks.toLocaleString()}</td>
            <td className="px-5 py-4 text-center">
                <ActionsDropdown 
                    campaign={campaign} 
                    onEdit={() => onEdit(campaign)}
                    onDuplicate={() => onDuplicate(campaign)}
                    onDelete={() => onDelete(campaign)}
                    onUpdate={onUpdate}
                    onViewDetails={() => onViewDetails(campaign)}
                />
            </td>
        </tr>
    );
};

const CampaignScreen: React.FC<CampaignScreenProps> = ({ setActiveTab, campaigns, onCreate, onEdit, onDuplicate, onDelete, onUpdate, onViewDetails }) => {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Campaign['status']>('All');
  const [channelFilter, setChannelFilter] = useState<'All' | Campaign['channel']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Memoized filtering logic
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(c => statusFilter === 'All' || c.status === statusFilter)
      .filter(c => channelFilter === 'All' || c.channel === channelFilter)
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [campaigns, statusFilter, channelFilter, searchTerm]);

  // Memoized pagination logic
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCampaigns.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCampaigns, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredCampaigns.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-800">Campaigns</h2>
          <p className="text-stone-500 mt-1">Create, schedule, and track all your campaigns.</p>
        </div>
        <Button icon={<PlusIcon />} onClick={onCreate}>Create Campaign</Button>
      </div>

      <Card className="overflow-hidden p-0 flex flex-col">
        {/* Filters Section */}
        <div className="p-4 flex flex-wrap gap-4 items-center border-b border-stone-200">
          <div className="relative flex-grow min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
          </select>
          <select
            value={channelFilter}
            onChange={e => {
              setChannelFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Channels</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="SMS">SMS</option>
            <option value="AgroBEET Network">AgroBEET Network</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b-2 border-stone-200 text-xs text-stone-500 uppercase bg-stone-50">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Campaign Name</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Channel</th>
                <th scope="col" className="px-5 py-3 font-semibold">Start Date</th>
                <th scope="col" className="px-5 py-3 font-semibold text-right">Reach</th>
                <th scope="col" className="px-5 py-3 font-semibold text-right">Clicks</th>
                <th scope="col" className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCampaigns.length > 0 ? (
                paginatedCampaigns.map(campaign => <CampaignRow key={campaign.id} campaign={campaign} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} onUpdate={onUpdate} onViewDetails={onViewDetails} />)
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <p className="text-stone-500 font-semibold">No campaigns found</p>
                    <p className="text-sm text-stone-400 mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {filteredCampaigns.length > 0 && (
          <div className="p-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className="flex items-center gap-2 text-sm">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={e => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-stone-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <span className="text-sm text-stone-600">
              {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="p-2" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </Button>
              <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
              <Button variant="outline" className="p-2" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CampaignScreen;