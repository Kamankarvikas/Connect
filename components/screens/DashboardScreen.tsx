import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, WalletIcon, ChannelIcon, CampaignIcon, UsersIcon, MouseClickIcon, TargetIcon, TrendingUpIcon, TrendingDownIcon } from '../Icons';
import { Tab } from '../../types';
import { TABS } from '../../constants';


const performanceData = [
  { name: 'Jan', Clicks: 400, Reach: 2400 },
  { name: 'Feb', Clicks: 300, Reach: 1398 },
  { name: 'Mar', Clicks: 200, Reach: 9800 },
  { name: 'Apr', Clicks: 278, Reach: 3908 },
  { name: 'May', Clicks: 189, Reach: 4800 },
  { name: 'Jun', Clicks: 239, Reach: 3800 },
];

const channelData = [
  { name: 'WhatsApp', value: 450 },
  { name: 'SMS', value: 300 },
  { name: 'AgroBEET Network', value: 150 },
];
const COLORS = ['#22c55e', '#64748b', '#3b82f6'];

interface DashboardScreenProps {
  setActiveTab: (tab: Tab) => void;
}

const StatCard: React.FC<{ title: string; value: string; change: string; isUp: boolean; icon: React.ReactNode; color: string }> = ({ title, value, change, isUp, icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div className="flex-grow">
      <p className="text-sm text-stone-500">{title}</p>
      <p className="text-2xl font-bold text-stone-800 mt-1">{value}</p>
    </div>
    <div className={`text-sm flex items-center font-semibold ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
        {isUp ? <TrendingUpIcon className="w-5 h-5" /> : <TrendingDownIcon className="w-5 h-5" />}
        <span className="ml-1">{change}</span>
    </div>
  </Card>
);


const DashboardScreen: React.FC<DashboardScreenProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8">
      {/* Header and Quick Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-800">Dashboard</h2>
          <p className="text-stone-500 mt-1">Here's an overview of your campaign performance.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" icon={<ChannelIcon />}>Connect Channel</Button>
          <Button variant="secondary" icon={<WalletIcon />}>Add Funds</Button>
          <Button icon={<PlusIcon />} onClick={() => setActiveTab(TABS.CREATE_CAMPAIGN)}>Create Campaign</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          <StatCard title="Total Campaigns" value="42" change="+5" isUp={true} icon={<CampaignIcon className="w-6 h-6 text-emerald-700"/>} color="bg-emerald-100" />
          <StatCard title="Active Campaigns" value="5" change="-1" isUp={false} icon={<CampaignIcon className="w-6 h-6 text-amber-700"/>} color="bg-amber-100" />
          <StatCard title="Total Reach" value="34.5k" change="+12.5%" isUp={true} icon={<UsersIcon className="w-6 h-6 text-sky-700"/>} color="bg-sky-100" />
          <StatCard title="Total Clicks" value="2,842" change="+8.2%" isUp={true} icon={<MouseClickIcon className="w-6 h-6 text-indigo-700"/>} color="bg-indigo-100" />
          <StatCard title="Conversions" value="312" change="+21%" isUp={true} icon={<TargetIcon className="w-6 h-6 text-pink-700"/>} color="bg-pink-100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="name" tick={{ fill: '#78716c' }} fontSize={12} />
                        <YAxis tick={{ fill: '#78716c' }} fontSize={12}/>
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '0.5rem' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="Reach" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Clicks" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold mb-4">Channel Distribution</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={channelData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                            {channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardScreen;