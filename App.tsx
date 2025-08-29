import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardScreen from './components/screens/DashboardScreen';
import ChannelOnboardingScreen from './components/screens/ChannelOnboardingScreen';
import TemplateCreationScreen from './components/screens/TemplateCreationScreen';
import CampaignScreen from './components/screens/CampaignScreen';
import WalletScreen from './components/screens/WalletScreen';
import OtherScreen from './components/screens/OtherScreen';
import CreateCampaignScreen from './components/screens/CreateCampaignScreen';
import AudienceScreen from './components/screens/AudienceScreen';
import LandingPage from './components/screens/LandingPage';
import AuthScreen from './components/screens/AuthScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import CompanyProfileScreen from './components/screens/CompanyProfileScreen';
import CampaignDetailScreen from './components/screens/CampaignDetailScreen';
import CampaignReportScreen from './components/screens/CampaignReportScreen';
import InboxScreen from './components/screens/InboxScreen';
import { Tab, Campaign, Template, Audience, Conversation, Message } from './types';
import { TABS, MOCK_CAMPAIGNS, MOCK_TEMPLATES, MOCK_AUDIENCES, MOCK_CONVERSATIONS, MOCK_MESSAGES } from './constants';
import DuplicateCampaignDialog from './components/shared/DuplicateCampaignDialog';
import ConfirmationDialog from './components/shared/ConfirmationDialog';
import { useToast } from './hooks/useToast';

type View = 'landing' | 'auth' | 'dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(TABS.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { addToast } = useToast();

  // Global Data State
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [audiences, setAudiences] = useState<Audience[]>(MOCK_AUDIENCES);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);


  // State for modals, detail views, and campaign creation flow
  const [campaignDraft, setCampaignDraft] = useState<Partial<Campaign> | null>(null);
  const [campaignForViewing, setCampaignForViewing] = useState<Campaign | null>(null);
  const [campaignToDuplicate, setCampaignToDuplicate] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [campaignForReport, setCampaignForReport] = useState<Campaign | null>(null);

  // Modal State for in-context creation
  const [isCreateTemplateModalOpen, setCreateTemplateModalOpen] = useState(false);
  const [isCreateAudienceModalOpen, setCreateAudienceModalOpen] = useState(false);

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prevCampaigns => [campaign, ...prevCampaigns]);
  };

  const updateCampaign = (updatedCampaign: Campaign) => {
    setCampaigns(prevCampaigns => 
        prevCampaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c)
    );
     if (campaignForViewing?.id === updatedCampaign.id) {
        setCampaignForViewing(updatedCampaign);
    }
  };

  const handleAddTemplate = (template: Template) => {
    const isEditing = templates.some(t => t.id === template.id);
    if (isEditing) {
      setTemplates(prev => prev.map(t => (t.id === template.id ? template : t)));
      addToast('Template updated successfully!', 'success');
    } else {
      setTemplates(prev => [template, ...prev]);
      addToast('Template created successfully!', 'success');
    }

    if (isCreateTemplateModalOpen) {
      setCampaignDraft(d => (d ? { ...d, templateId: template.id } : null));
      setCreateTemplateModalOpen(false);
    }
  };

  const handleAddAudience = (audience: Audience) => {
    const isEditing = audiences.some(a => a.id === audience.id);
    if (isEditing) {
      setAudiences(prev => prev.map(a => (a.id === audience.id ? audience : a)));
      addToast('Audience updated successfully!', 'success');
    } else {
      setAudiences(prev => [audience, ...prev]);
      addToast('Audience created successfully!', 'success');
    }
    
    if (isCreateAudienceModalOpen) {
      setCampaignDraft(d => (d ? { ...d, audienceId: audience.id } : null));
      setCreateAudienceModalOpen(false);
    }
  };
  
  const handleStartCreateCampaign = () => {
    setCampaignDraft({});
    setActiveTab(TABS.CREATE_CAMPAIGN);
  };

  const handleEdit = (campaign: Campaign) => {
    setCampaignDraft(campaign);
    setActiveTab(TABS.CREATE_CAMPAIGN);
  };
  
  const handleStartDuplicate = (campaign: Campaign) => {
    setCampaignToDuplicate(campaign);
  };
  
  const handleConfirmDuplicate = (count: number) => {
    if (!campaignToDuplicate) return;
    
    const copies = Array.from({ length: count }, (_, i) => {
        const campaignCopy = JSON.parse(JSON.stringify(campaignToDuplicate));
        return { 
            ...campaignCopy, 
            id: Date.now() + i, 
            name: `${campaignToDuplicate.name} (Copy ${i + 1})`,
            status: 'Draft' as const,
            reach: 0,
            clicks: 0,
            startDate: new Date().toISOString().split('T')[0]
        };
    });

    setCampaigns(prev => [...copies, ...prev]);
    addToast(`${count} campaign${count > 1 ? 's' : ''} duplicated successfully!`, 'success');
    setCampaignToDuplicate(null);
  };

  const handleStartDelete = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
  };

  const handleConfirmDelete = () => {
    if (!campaignToDelete) return;
    setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id));
    addToast(`Campaign "${campaignToDelete.name}" deleted.`, 'success');
    if (campaignForViewing?.id === campaignToDelete.id) {
        setActiveTab(TABS.CAMPAIGN);
        setCampaignForViewing(null);
    }
    if (campaignForReport?.id === campaignToDelete.id) {
        setActiveTab(TABS.CAMPAIGN);
        setCampaignForReport(null);
    }
    setCampaignToDelete(null);
  };
  
  const handleViewDetails = (campaign: Campaign) => {
    setCampaignForViewing(campaign);
    setActiveTab(TABS.CAMPAIGN_DETAIL);
  };

  const handleViewReport = (campaign: Campaign) => {
    setCampaignForReport(campaign);
    setActiveTab(TABS.CAMPAIGN_REPORT);
  };

  const handleSendMessage = (conversationId: number, text: string) => {
    const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId,
        sender: 'Admin',
        text,
        timestamp: new Date().toISOString(),
        status: 'sent',
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Also update the last message in the conversation list
    setConversations(prev => prev.map(convo => {
        if (convo.id === conversationId) {
            return {
                ...convo,
                lastMessage: text,
                lastMessageTimestamp: new Date().toISOString(),
            };
        }
        return convo;
    }));

    // Simulate a farmer's reply after a short delay for demo purposes
    setTimeout(() => {
        const farmerReply: Message = {
            id: `msg_${Date.now() + 1}`,
            conversationId,
            sender: 'Farmer',
            text: "Thanks for the quick response! I'll take a look.",
            timestamp: new Date().toISOString(),
            status: 'delivered'
        };
        setMessages(prev => [...prev, farmerReply]);
         setConversations(prev => prev.map(convo => {
            if (convo.id === conversationId) {
                return {
                    ...convo,
                    lastMessage: farmerReply.text,
                    lastMessageTimestamp: new Date().toISOString(),
                    unreadCount: (convo.unreadCount || 0) + 1,
                };
            }
            return convo;
        }));
    }, 2500);
};

  const handleLogin = () => {
    setIsOnboardingComplete(false); 
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setActiveTab(TABS.DASHBOARD);
  }
  
  if (currentView === 'landing') {
    return <LandingPage onNavigateToAuth={() => setCurrentView('auth')} />;
  }

  if (currentView === 'auth') {
    return <AuthScreen onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'dashboard' && !isOnboardingComplete) {
    return <OnboardingScreen onOnboardingComplete={() => setIsOnboardingComplete(true)} />;
  }
  
  const renderContent = () => {
    switch (activeTab) {
      case TABS.DASHBOARD:
        return <DashboardScreen setActiveTab={setActiveTab} />;
      case TABS.CHANNEL_ONBOARDING:
        return <ChannelOnboardingScreen />;
      case TABS.TEMPLATE_CREATION:
        return <TemplateCreationScreen 
                    templates={templates}
                    setTemplates={setTemplates}
                    onSave={handleAddTemplate}
                />;
      case TABS.CAMPAIGN:
        return <CampaignScreen 
                    setActiveTab={setActiveTab} 
                    campaigns={campaigns} 
                    onCreate={handleStartCreateCampaign}
                    onEdit={handleEdit}
                    onDuplicate={handleStartDuplicate}
                    onDelete={handleStartDelete}
                    onUpdate={updateCampaign}
                    onViewDetails={handleViewDetails}
                />;
      case TABS.AUDIENCE:
        return <AudienceScreen
                    audiences={audiences}
                    setAudiences={setAudiences}
                    onSave={handleAddAudience}
                />;
      case TABS.INBOX:
        return <InboxScreen
                    conversations={conversations}
                    setConversations={setConversations}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                />;
      case TABS.CREATE_CAMPAIGN:
        if (campaignDraft === null) {
            setActiveTab(TABS.CAMPAIGN);
            return null;
        }
        return <CreateCampaignScreen 
                    setActiveTab={setActiveTab} 
                    addCampaign={addCampaign}
                    updateCampaign={updateCampaign}
                    campaignDraft={campaignDraft}
                    setCampaignDraft={setCampaignDraft}
                    onFlowComplete={() => setCampaignDraft(null)}
                    templates={templates}
                    audiences={audiences}
                    onOpenCreateTemplateModal={() => setCreateTemplateModalOpen(true)}
                    onOpenCreateAudienceModal={() => setCreateAudienceModalOpen(true)}
                />;
      case TABS.CAMPAIGN_DETAIL:
        return campaignForViewing ? 
                <CampaignDetailScreen 
                    campaign={campaignForViewing}
                    onBack={() => setActiveTab(TABS.CAMPAIGN)}
                    onEdit={handleEdit}
                    onDuplicate={handleStartDuplicate}
                    onDelete={handleStartDelete}
                    onUpdateStatus={updateCampaign}
                    onViewReport={handleViewReport}
                /> 
                : null;
      case TABS.CAMPAIGN_REPORT:
        return campaignForReport ?
                <CampaignReportScreen
                    campaign={campaignForReport}
                    onBack={() => setActiveTab(TABS.CAMPAIGN_DETAIL)}
                />
                : null;
      case TABS.WALLET:
        return <WalletScreen />;
      case TABS.COMPANY_PROFILE:
        return <CompanyProfileScreen />;
      case TABS.OTHER:
        return <OtherScreen />;
      default:
        return <DashboardScreen setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-stone-100/50 font-sans text-stone-800">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-50 p-6 md:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      {campaignToDuplicate && (
        <DuplicateCampaignDialog
            isOpen={!!campaignToDuplicate}
            onClose={() => setCampaignToDuplicate(null)}
            onConfirm={handleConfirmDuplicate}
            campaignName={campaignToDuplicate.name}
        />
      )}
      {campaignToDelete && (
          <ConfirmationDialog
            isOpen={!!campaignToDelete}
            onClose={() => setCampaignToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Delete Campaign"
            message={`Are you sure you want to delete the campaign "${campaignToDelete.name}"? This action cannot be undone.`}
            confirmText="Delete"
          />
      )}
      {isCreateTemplateModalOpen && (
        <TemplateCreationScreen
            isModal={true}
            onSave={handleAddTemplate}
            onCancel={() => setCreateTemplateModalOpen(false)}
        />
      )}
      {isCreateAudienceModalOpen && (
        <AudienceScreen
            isModal={true}
            onSave={handleAddAudience}
            onCancel={() => setCreateAudienceModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;