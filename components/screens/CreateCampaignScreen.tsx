import React, { useState, useMemo, useEffect } from 'react';
import { Tab, Template, Campaign, Audience } from '../../types';
// FIX: Import mock account data from constants to resolve reference errors.
import { TABS, MOCK_WHATSAPP_ACCOUNTS, MOCK_SMS_ACCOUNTS, MOCK_NETWORK_ACCOUNTS } from '../../constants';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { WhatsAppIcon, SmsIcon, AppIcon, SearchIcon, UsersGroupIcon, CalendarIcon, PlusIcon } from '../Icons';
import WhatsAppPreview from '../shared/WhatsAppPreview';
import SmsPreview from '../shared/SmsPreview';
import AppPreview from '../shared/AppPreview';
import { useToast } from '../../hooks/useToast';

interface CreateCampaignScreenProps {
  setActiveTab: (tab: Tab) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  campaignDraft: Partial<Campaign>;
  setCampaignDraft: React.Dispatch<React.SetStateAction<Partial<Campaign> | null>>;
  onFlowComplete: () => void;
  templates: Template[];
  audiences: Audience[];
  onOpenCreateTemplateModal: () => void;
  onOpenCreateAudienceModal: () => void;
}

const STEPS = [
  { id: 1, name: 'Setup' },
  { id: 2, name: 'Template' },
  { id: 3, name: 'Audience' },
  { id: 4, name: 'Review & Schedule' },
];

const CreateCampaignScreen: React.FC<CreateCampaignScreenProps> = ({ 
    setActiveTab, addCampaign, updateCampaign, campaignDraft, setCampaignDraft, onFlowComplete, 
    templates, audiences, onOpenCreateTemplateModal, onOpenCreateAudienceModal 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { addToast } = useToast();
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // State for template filtering & pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [templatePage, setTemplatePage] = useState(1);
  const [templatesPerPage] = useState(4);

  // State for audience pagination
  const [audiencePage, setAudiencePage] = useState(1);
  const [audiencesPerPage] = useState(4);


  const handleUpdate = (field: keyof Campaign, value: any) => {
    setCampaignDraft(draft => draft ? { ...draft, [field]: value } : null);
  };
  
  const handleChannelSelect = (c: 'WhatsApp' | 'SMS' | 'AgroBEET Network') => {
    setCampaignDraft(draft => draft ? { 
        ...draft, 
        channel: c, 
        accountId: undefined,
        phoneNumberId: undefined
    } : null);
  };
  
  const selectedTemplate = useMemo(() => {
      return templates.find(t => t.id === campaignDraft?.templateId);
  }, [campaignDraft?.templateId, templates]);

  const selectedAudience = useMemo(() => {
      return audiences.find(a => a.id === campaignDraft?.audienceId);
  }, [campaignDraft?.audienceId, audiences]);


  const filteredTemplates = useMemo(() => {
    if (!campaignDraft?.channel) return [];
    return templates.filter(t => 
        t.channel === campaignDraft.channel && 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campaignDraft?.channel, searchTerm, templates]);

  const paginatedTemplates = useMemo(() => {
      const startIndex = (templatePage - 1) * templatesPerPage;
      return filteredTemplates.slice(startIndex, startIndex + templatesPerPage);
  }, [filteredTemplates, templatePage, templatesPerPage]);

  const totalTemplatePages = Math.ceil(filteredTemplates.length / templatesPerPage);


  const paginatedAudiences = useMemo(() => {
      const startIndex = (audiencePage - 1) * audiencesPerPage;
      return audiences.slice(startIndex, startIndex + audiencesPerPage);
  }, [audiences, audiencePage, audiencesPerPage]);

  const totalAudiencePages = Math.ceil(audiences.length / audiencesPerPage);


  const canProceed = () => {
    if (currentStep === 1) {
      if (!campaignDraft?.name || !campaignDraft?.channel || !campaignDraft?.accountId) {
        return false;
      }
      return true;
    }
    if (currentStep === 2) return !!campaignDraft?.templateId;
    if (currentStep === 3) return !!campaignDraft?.audienceId;
    return true;
  };

  const buildCampaignObject = (status: Campaign['status']): Campaign => {
    const isNew = !campaignDraft?.id;
    
    let finalStatus = status;
    let finalStartDate = new Date().toISOString().split('T')[0];
    let finalScheduleDate = campaignDraft?.scheduleDate;
    
    if (status !== 'Draft') {
        const scheduleType = campaignDraft?.scheduleDate ? 'later' : 'now';
        finalStatus = scheduleType === 'later' ? 'Scheduled' : 'Running';
        finalStartDate = scheduleType === 'later' ? new Date(campaignDraft!.scheduleDate!).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    }

    return {
      id: isNew ? Date.now() : campaignDraft!.id!,
      name: campaignDraft?.name || 'Unnamed Campaign',
      status: finalStatus,
      channel: campaignDraft?.channel!,
      reach: isNew ? 0 : campaignDraft!.reach || 0,
      clicks: isNew ? 0 : campaignDraft!.clicks || 0,
      startDate: finalStartDate,
      accountId: campaignDraft?.accountId,
      phoneNumberId: campaignDraft?.phoneNumberId,
      templateId: campaignDraft?.templateId,
      audienceId: campaignDraft?.audienceId,
      scheduleDate: finalScheduleDate,
    };
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
        const campaign = buildCampaignObject('Scheduled');
        
        if (!campaignDraft?.id) {
            addCampaign(campaign);
        } else {
            updateCampaign(campaign);
        }
        
        setIsFinishing(false);
        const message = campaign.status === 'Scheduled' ? 'Campaign scheduled successfully!' : 'Campaign launched successfully!';
        addToast(message, 'success');
        onFlowComplete();
        setActiveTab(TABS.CAMPAIGN);
    }, 1500);
  }
  
  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
        const draftCampaign = buildCampaignObject('Draft');

        if (campaignDraft?.id) {
            updateCampaign(draftCampaign);
        } else {
            addCampaign(draftCampaign);
        }
        
        setIsSavingDraft(false);
        addToast('Campaign saved as draft.', 'success');
        onFlowComplete();
        setActiveTab(TABS.CAMPAIGN);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-stone-800">{campaignDraft?.id ? 'Edit Campaign' : 'Create New Campaign'}</h2>
        <p className="text-stone-500 mt-1">Follow the steps to setup and launch your campaign.</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= step.id ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'}`}>
                            {step.id}
                        </div>
                        <span className={`ml-3 font-semibold ${currentStep >= step.id ? 'text-emerald-700' : 'text-stone-500'}`}>{step.name}</span>
                    </div>
                    {index < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>}
                </React.Fragment>
            ))}
        </div>
      </Card>

      <Card>
        {currentStep === 1 && (
            <div className="space-y-6">
                <h3 className="text-xl font-bold">1. Campaign Setup</h3>
                <div>
                    <label htmlFor="campaignName" className="block text-sm font-medium text-stone-700 mb-1">Campaign Name</label>
                    <input type="text" id="campaignName" value={campaignDraft?.name || ''} onChange={e => handleUpdate('name', e.target.value)} placeholder="e.g., Spring Planting Sale" className="w-full max-w-lg px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Channel</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ChannelCard icon={<WhatsAppIcon className="w-8 h-8 text-emerald-600" />} title="WhatsApp" onClick={() => handleChannelSelect('WhatsApp')} isSelected={campaignDraft?.channel === 'WhatsApp'} />
                        <ChannelCard icon={<SmsIcon className="w-8 h-8 text-slate-600" />} title="SMS" onClick={() => handleChannelSelect('SMS')} isSelected={campaignDraft?.channel === 'SMS'} />
                        <ChannelCard icon={<AppIcon className="w-8 h-8 text-blue-600" />} title="AgroBEET Network" onClick={() => handleChannelSelect('AgroBEET Network')} isSelected={campaignDraft?.channel === 'AgroBEET Network'} />
                    </div>
                </div>
                 {campaignDraft?.channel && (
                    <div className="pt-6 border-t border-stone-200/80 animate-fade-in">
                        <label htmlFor="account" className="block text-sm font-medium text-stone-700 mb-1">Select Account</label>
                        <select 
                            id="account" 
                            value={campaignDraft?.accountId || ''} 
                            onChange={e => handleUpdate('accountId', e.target.value)} 
                            className="w-full max-w-lg bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">-- Choose an account --</option>
                            {campaignDraft.channel === 'WhatsApp' && MOCK_WHATSAPP_ACCOUNTS.filter(acc => acc.status === 'Active').map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.identifier})</option>)}
                            {campaignDraft.channel === 'SMS' && MOCK_SMS_ACCOUNTS.filter(acc => acc.status === 'Active').map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.identifier})</option>)}
                            {campaignDraft.channel === 'AgroBEET Network' && MOCK_NETWORK_ACCOUNTS.filter(acc => acc.status === 'Active').map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.identifier})</option>)}
                        </select>
                    </div>
                )}
            </div>
        )}

        {currentStep === 2 && (
             <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <h3 className="text-xl font-bold">2. Select a Template</h3>
                  <Button variant="outline" icon={<PlusIcon/>} onClick={onOpenCreateTemplateModal}>Create New Template</Button>
                </div>
                <div className="relative flex-grow max-w-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-stone-400" /></div>
                    <input type="text" placeholder="Search templates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[360px]">
                            {paginatedTemplates.map(template => (
                                <TemplateCard key={template.id} template={template} onClick={() => handleUpdate('templateId', template.id)} isSelected={campaignDraft?.templateId === template.id} />
                            ))}
                        </div>
                        {totalTemplatePages > 1 && (
                            <PaginationControls currentPage={templatePage} totalPages={totalTemplatePages} onPageChange={setTemplatePage} />
                        )}
                    </div>
                    <div className="bg-stone-100 rounded-lg p-4 flex items-center justify-center">
                        {!selectedTemplate ? ( <p className="text-stone-500">Select a template to see a preview.</p> ) 
                        : campaignDraft?.channel === 'WhatsApp' ? ( <WhatsAppPreview headerType={selectedTemplate.headerType || 'None'} headerText={selectedTemplate.headerText} body={selectedTemplate.body} footer={selectedTemplate.footer} quickReplyButtons={selectedTemplate.buttonType === 'QUICK_REPLY' ? selectedTemplate.quickReplyButtons : []} callToActionButtons={selectedTemplate.buttonType === 'CALL_TO_ACTION' ? selectedTemplate.callToActionButtons : []} /> ) 
                        : campaignDraft?.channel === 'SMS' ? ( <SmsPreview senderId={selectedTemplate.senderId} body={selectedTemplate.body} /> ) 
                        : campaignDraft?.channel === 'AgroBEET Network' ? ( <AppPreview name={selectedTemplate.name} body={selectedTemplate.body} templateType={selectedTemplate.templateType} placementType={selectedTemplate.placementType} /> ) 
                        : ( <div className="text-center p-4 bg-white rounded-lg border"><h4 className="font-bold">{selectedTemplate.name}</h4><p className="mt-4 text-sm text-stone-600 whitespace-pre-wrap">{selectedTemplate.body}</p></div> )}
                    </div>
                </div>
            </div>
        )}

        {currentStep === 3 && (
            <div className="space-y-6 max-w-3xl">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <h3 className="text-xl font-bold">3. Define Audience</h3>
                  <Button variant="outline" icon={<PlusIcon/>} onClick={onOpenCreateAudienceModal}>Create New Audience</Button>
                </div>
                <p className="text-stone-600">Choose which segment of users will receive this campaign.</p>
                <div className="space-y-3 min-h-[300px]">
                    {paginatedAudiences.map(segment => (
                        <div key={segment.id} onClick={() => handleUpdate('audienceId', segment.id)} className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all ${campaignDraft?.audienceId === segment.id ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-stone-300'}`}>
                            <div>
                                <p className="font-semibold text-stone-800">{segment.name}</p>
                                <p className="text-sm text-stone-500">Estimated Recipients: {segment.userCount.toLocaleString()}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${campaignDraft?.audienceId === segment.id ? 'border-emerald-600 bg-emerald-600' : 'border-stone-400'}`}>
                                {campaignDraft?.audienceId === segment.id && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 9"><path d="M1 4.5L4.5 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                        </div>
                    ))}
                </div>
                {totalAudiencePages > 1 && (
                    <PaginationControls currentPage={audiencePage} totalPages={totalAudiencePages} onPageChange={setAudiencePage} />
                )}
            </div>
        )}
        
        {currentStep === 4 && (
             <div className="space-y-6">
                <h3 className="text-xl font-bold">4. Review & Schedule</h3>
                <div className="space-y-4 bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <SummaryItem label="Campaign Name" value={campaignDraft?.name} />
                    <SummaryItem label="Channel" value={campaignDraft?.channel} icon={campaignDraft?.channel === 'WhatsApp' ? <WhatsAppIcon className="w-5 h-5 text-emerald-600" /> : campaignDraft?.channel === 'SMS' ? <SmsIcon className="w-5 h-5 text-slate-600" /> : <AppIcon className="w-5 h-5 text-blue-600" />} />
                    <SummaryItem label="Audience" value={selectedAudience?.name} icon={<UsersGroupIcon className="w-5 h-5 text-stone-500"/>} />
                    <SummaryItem label="Template" value={selectedTemplate?.name || 'N/A'} />
                    <div className="pt-4 border-t border-stone-200">
                        <p className="font-semibold text-stone-700 mb-2">Message Preview</p>
                        <p className="text-sm text-stone-600 bg-white p-3 rounded-md">{selectedTemplate?.body}</p>
                    </div>
                </div>
                <div className="max-w-md">
                    <h4 className="font-semibold text-stone-800 mb-2">Schedule</h4>
                    <div className="space-y-3">
                        <div onClick={() => handleUpdate('scheduleDate', undefined)} className={`p-4 border rounded-lg cursor-pointer flex items-center ${!campaignDraft?.scheduleDate ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-stone-300'}`}>
                           <p className="font-semibold text-stone-800">Send Immediately</p>
                        </div>
                        <div onClick={() => handleUpdate('scheduleDate', campaignDraft?.scheduleDate || new Date().toISOString().slice(0, 16))} className={`p-4 border rounded-lg cursor-pointer ${campaignDraft?.scheduleDate ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-stone-300'}`}>
                           <p className="font-semibold text-stone-800 mb-2">Schedule for Later</p>
                           {campaignDraft?.scheduleDate && (
                                <input type="datetime-local" value={campaignDraft.scheduleDate} onChange={e => handleUpdate('scheduleDate', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                           )}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </Card>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)} disabled={currentStep === 1 || (!!campaignDraft?.id && !campaignDraft.name)}>Back</Button>
        <div className="flex items-center space-x-3">
            {currentStep === 4 && (<Button variant="outline" onClick={handleSaveDraft} loading={isSavingDraft}>Save as Draft</Button>)}
            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>Next Step</Button>
            ) : (
              <Button onClick={handleFinish} loading={isFinishing} icon={campaignDraft?.scheduleDate ? <CalendarIcon /> : undefined}>
                {campaignDraft?.scheduleDate ? 'Schedule Campaign' : 'Launch Campaign Now'}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

const ChannelCard: React.FC<{icon: React.ReactNode, title: string, isSelected: boolean, onClick: () => void}> = ({ icon, title, isSelected, onClick }) => (
    <div onClick={onClick} className={`p-6 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 hover:border-emerald-400'}`}>
        <div className="mb-2">{icon}</div>
        <p className="font-semibold text-stone-700">{title}</p>
    </div>
);

const TemplateCard: React.FC<{template: Template, isSelected: boolean, onClick: () => void}> = ({ template, isSelected, onClick }) => (
    <div onClick={onClick} className={`p-4 border-2 rounded-lg cursor-pointer h-full flex flex-col ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 hover:border-emerald-400'}`}>
        <p className="font-bold text-stone-800 mb-2">{template.name}</p>
        <p className="text-xs text-stone-500 flex-grow">{template.body}</p>
    </div>
);

const SummaryItem: React.FC<{label: string, value?: string | null, icon?: React.ReactNode}> = ({label, value, icon}) => (
    <div className="flex items-start justify-between">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <p className="text-stone-500">{label}</p>
        </div>
        <p className="font-semibold text-stone-800 text-right">{value}</p>
    </div>
);

const PaginationControls: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" className="p-2" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Button>
        <span className="text-sm font-medium px-2 text-stone-600">
            Page {currentPage} of {totalPages}
        </span>
        <Button variant="outline" className="p-2" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Button>
    </div>
);


export default CreateCampaignScreen;