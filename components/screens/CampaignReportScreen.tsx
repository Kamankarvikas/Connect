import React, { useState, useMemo } from 'react';
import { Campaign, CampaignRecipientLog } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { ArrowLeftIcon, SearchIcon, CheckCircleIcon, XCircleIcon, MouseClickIcon, UsersIcon } from '../Icons';
import { MOCK_CAMPAIGN_LOGS } from '../../constants';

interface CampaignReportScreenProps {
  campaign: Campaign;
  onBack: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-stone-500">{title}</p>
      <p className="text-2xl font-bold text-stone-800 mt-1">{value}</p>
    </div>
  </Card>
);

const LogRow: React.FC<{ log: CampaignRecipientLog }> = ({ log }) => {
    const statusClasses: Record<CampaignRecipientLog['status'], string> = {
        Sent: 'bg-blue-100 text-blue-800',
        Delivered: 'bg-emerald-100 text-emerald-800',
        Clicked: 'bg-indigo-100 text-indigo-800',
        Failed: 'bg-red-100 text-red-800',
    };
    return (
        <tr className="border-b border-stone-200 hover:bg-stone-50/80">
            <td className="px-5 py-3 font-medium text-stone-800">{log.farmerName}</td>
            <td className="px-5 py-3 text-stone-600 font-mono">{log.phoneNumber}</td>
            <td className="px-5 py-3 text-stone-600">{new Date(log.timestamp).toLocaleString()}</td>
            <td className="px-5 py-3">
                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[log.status]}`}>
                    {log.status}
                </span>
            </td>
        </tr>
    );
};

const CampaignReportScreen: React.FC<CampaignReportScreenProps> = ({ campaign, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | CampaignRecipientLog['status']>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const campaignLogs = useMemo(() => MOCK_CAMPAIGN_LOGS.filter(log => log.campaignId === campaign.id), [campaign.id]);

    const deliveryStats = useMemo(() => {
        const stats = {
            sent: campaignLogs.length,
            delivered: campaignLogs.filter(l => l.status === 'Delivered' || l.status === 'Clicked').length,
            clicked: campaignLogs.filter(l => l.status === 'Clicked').length,
            failed: campaignLogs.filter(l => l.status === 'Failed').length,
        };
        return stats;
    }, [campaignLogs]);

    const filteredLogs = useMemo(() => {
        return campaignLogs
            .filter(log => statusFilter === 'All' || log.status === statusFilter)
            .filter(log => 
                log.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.phoneNumber.includes(searchTerm)
            );
    }, [campaignLogs, statusFilter, searchTerm]);

    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredLogs.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredLogs, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Campaign Details
            </Button>
            
            <div>
                <h2 className="text-3xl font-bold text-stone-800">Delivery Report</h2>
                <p className="text-stone-500 mt-1">Campaign: <span className="font-semibold text-stone-700">{campaign.name}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Sent" value={deliveryStats.sent.toLocaleString()} icon={<UsersIcon className="w-6 h-6 text-sky-700"/>} color="bg-sky-100" />
                <StatCard title="Delivered" value={deliveryStats.delivered.toLocaleString()} icon={<CheckCircleIcon className="w-6 h-6 text-emerald-700"/>} color="bg-emerald-100" />
                <StatCard title="Clicked" value={deliveryStats.clicked.toLocaleString()} icon={<MouseClickIcon className="w-6 h-6 text-indigo-700"/>} color="bg-indigo-100" />
                <StatCard title="Failed" value={deliveryStats.failed.toLocaleString()} icon={<XCircleIcon className="w-6 h-6 text-red-700"/>} color="bg-red-100" />
            </div>
            
            <Card className="overflow-hidden p-0 flex flex-col">
                <div className="p-4 flex flex-wrap gap-4 items-center border-b border-stone-200">
                    <div className="relative flex-grow min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Sent">Sent</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Clicked">Clicked</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b-2 border-stone-200 text-xs text-stone-500 uppercase bg-stone-50">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-left">Farmer Name</th>
                                <th className="px-5 py-3 font-semibold text-left">Phone Number</th>
                                <th className="px-5 py-3 font-semibold text-left">Timestamp</th>
                                <th className="px-5 py-3 font-semibold text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {paginatedLogs.map(log => <LogRow key={log.id} log={log} />)}
                        </tbody>
                    </table>
                </div>
                 {filteredLogs.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-stone-500 font-semibold">No logs found</p>
                        <p className="text-sm text-stone-400 mt-1">Try adjusting your search or filters.</p>
                    </div>
                 )}
                 {filteredLogs.length > 0 && (
                    <div className="p-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 mt-auto">
                        <span className="text-sm text-stone-600">
                            Showing {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, filteredLogs.length)} of {filteredLogs.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="p-2" disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </Button>
                            <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
                            <Button variant="outline" className="p-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Button>
                        </div>
                    </div>
                 )}
            </Card>
        </div>
    );
};

export default CampaignReportScreen;