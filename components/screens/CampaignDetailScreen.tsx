import React, { useMemo } from 'react';
import { Campaign, Template } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { ArrowLeftIcon, UsersIcon, MouseClickIcon, TargetIcon, CalendarIcon, PencilIcon, DocumentDuplicateIcon, PlayIcon, PauseIcon, TrashIcon, ClockIcon, WhatsAppIcon, SmsIcon, AppIcon, UsersGroupIcon, CheckCircleIcon, XCircleIcon } from '../Icons';
import { MOCK_TEMPLATES, MOCK_AUDIENCES, MOCK_CAMPAIGN_LOGS } from '../../constants';
import WhatsAppPreview from '../shared/WhatsAppPreview';
import SmsPreview from '../shared/SmsPreview';
import AppPreview from '../shared/AppPreview';

interface CampaignDetailScreenProps {
  campaign: Campaign;
  onBack: () => void;
  onEdit: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onUpdateStatus: (campaign: Campaign) => void;
  onViewReport: (campaign: Campaign) => void;
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

const DetailItem: React.FC<{ label: string; value: string | undefined; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-start">
        {icon && <div className="w-5 h-5 text-stone-500 mr-3 mt-0.5">{icon}</div>}
        <div>
            <p className="text-sm text-stone-500">{label}</p>
            <p className="font-semibold text-stone-800">{value || 'N/A'}</p>
        </div>
    </div>
);

const CampaignDetailScreen: React.FC<CampaignDetailScreenProps> = ({ campaign, onBack, onEdit, onDuplicate, onDelete, onUpdateStatus, onViewReport }) => {
    const template = useMemo(() => MOCK_TEMPLATES.find(t => t.id === campaign.templateId), [campaign.templateId]);
    const audience = useMemo(() => MOCK_AUDIENCES.find(a => a.id === campaign.audienceId), [campaign.audienceId]);

    const deliveryStats = useMemo(() => {
        const logs = MOCK_CAMPAIGN_LOGS.filter(log => log.campaignId === campaign.id);
        const stats = {
            sent: logs.filter(l => l.status === 'Sent').length,
            delivered: logs.filter(l => l.status === 'Delivered').length,
            clicked: logs.filter(l => l.status === 'Clicked').length,
            failed: logs.filter(l => l.status === 'Failed').length,
        };
        stats.delivered += stats.clicked; // Clicks are also delivered
        return stats;
    }, [campaign.id]);
    
    const conversionRate = useMemo(() => {
        if (campaign.reach === 0) return '0.00%';
        const totalDelivered = deliveryStats.delivered;
        if (totalDelivered === 0) return '0.00%';
        return ((deliveryStats.clicked / totalDelivered) * 100).toFixed(2) + '%';
    }, [campaign.reach, deliveryStats]);
    
    const statusClasses = {
        Draft: 'bg-stone-200 text-stone-800',
        Scheduled: 'bg-blue-100 text-blue-800',
        Running: 'bg-emerald-100 text-emerald-800 animate-pulse',
        Completed: 'bg-gray-100 text-gray-800',
        Paused: 'bg-amber-100 text-amber-800',
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to All Campaigns
            </Button>
            
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-stone-800">{campaign.name}</h2>
                     <span className={`px-4 py-1 text-sm font-semibold rounded-full ${statusClasses[campaign.status]}`}>
                        {campaign.status}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    {campaign.status === 'Draft' && <Button icon={<PencilIcon className="w-4 h-4"/>} onClick={() => onEdit(campaign)}>Edit</Button>}
                    {(campaign.status === 'Scheduled' || campaign.status === 'Running') && <Button variant="outline" icon={<PauseIcon className="w-4 h-4"/>} onClick={() => onUpdateStatus({...campaign, status: 'Paused'})}>Pause</Button>}
                    {campaign.status === 'Paused' && <Button variant="outline" icon={<PlayIcon className="w-4 h-4"/>} onClick={() => onUpdateStatus({...campaign, status: 'Running'})}>Resume</Button>}
                    <Button variant="outline" icon={<DocumentDuplicateIcon className="w-4 h-4"/>} onClick={() => onDuplicate(campaign)}>Duplicate</Button>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" icon={<TrashIcon className="w-4 h-4"/>} onClick={() => onDelete(campaign)}>Delete</Button>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Reach" value={campaign.reach.toLocaleString()} icon={<UsersIcon className="w-6 h-6 text-sky-700"/>} color="bg-sky-100" />
                <StatCard title="Total Clicks" value={deliveryStats.clicked.toLocaleString()} icon={<MouseClickIcon className="w-6 h-6 text-indigo-700"/>} color="bg-indigo-100" />
                <StatCard title="Conversion Rate" value={conversionRate} icon={<TargetIcon className="w-6 h-6 text-pink-700"/>} color="bg-pink-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <h3 className="text-xl font-bold mb-6 border-b border-stone-200 pb-4">Campaign Setup</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <DetailItem label="Channel" value={campaign.channel} icon={
                                campaign.channel === 'WhatsApp' ? <WhatsAppIcon className="w-5 h-5" /> :
                                campaign.channel === 'SMS' ? <SmsIcon className="w-5 h-5" /> :
                                <AppIcon className="w-5 h-5" />
                            } />
                            
                            <DetailItem label="Start Date" value={campaign.startDate} icon={<CalendarIcon className="w-5 h-5" />} />
                            {campaign.status === 'Scheduled' && campaign.scheduleDate && (
                                <DetailItem label="Scheduled For" value={new Date(campaign.scheduleDate).toLocaleString()} icon={<ClockIcon className="w-5 h-5" />} />
                            )}
                             {audience && (
                                <div className="sm:col-span-2">
                                    <DetailItem label="Audience" value={audience.name} icon={<UsersGroupIcon className="w-5 h-5"/>} />
                                    <p className="pl-8 text-sm text-stone-500 mt-1">{audience.description}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-stone-200 pb-4 mb-6">
                            <h3 className="text-xl font-bold">Delivery Report</h3>
                            <Button variant="outline" onClick={() => onViewReport(campaign)}>View Full Report</Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div><p className="text-2xl font-bold">{campaign.reach.toLocaleString()}</p><p className="text-sm text-stone-500">Sent</p></div>
                            <div><p className="text-2xl font-bold">{deliveryStats.delivered.toLocaleString()}</p><p className="text-sm text-stone-500">Delivered</p></div>
                            <div><p className="text-2xl font-bold">{deliveryStats.clicked.toLocaleString()}</p><p className="text-sm text-stone-500">Clicked</p></div>
                            <div><p className="text-2xl font-bold text-red-600">{deliveryStats.failed.toLocaleString()}</p><p className="text-sm text-stone-500">Failed</p></div>
                        </div>
                    </Card>

                </div>

                {/* Right Column (Template Preview) */}
                <div className="lg:col-span-1">
                     <Card>
                        <h3 className="text-xl font-bold mb-4">Template Preview</h3>
                        <div className="bg-stone-100 rounded-lg p-4 flex items-center justify-center h-[550px]">
                           {template ? (
                                <div className="scale-75 origin-center">
                                    {template.channel === 'WhatsApp' ? (
                                        <WhatsAppPreview
                                            headerType={template.headerType || 'None'}
                                            headerText={template.headerText}
                                            body={template.body}
                                            footer={template.footer}
                                            quickReplyButtons={template.buttonType === 'QUICK_REPLY' ? template.quickReplyButtons : []}
                                            callToActionButtons={template.buttonType === 'CALL_TO_ACTION' ? template.callToActionButtons : []}
                                        />
                                    ) : template.channel === 'SMS' ? (
                                        <SmsPreview senderId={template.senderId} body={template.body} />
                                    ) : template.channel === 'AgroBEET Network' ? (
                                        <AppPreview
                                            name={template.name}
                                            body={template.body}
                                            templateType={template.templateType}
                                            placementType={template.placementType}
                                        />
                                    ) : (
                                        <p>Preview not available</p>
                                    )}
                                </div>
                           ) : (
                               <p className="text-stone-500">No template associated with this campaign.</p>
                           )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailScreen;