import React, { useState, useMemo, useEffect } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, SearchIcon, CloseIcon, WhatsAppIcon, SmsIcon, AppIcon, LinkIcon, PhoneIcon, TrashIcon, UploadIcon, DocumentIcon, ViewIcon, PencilIcon, SortIcon } from '../Icons';
import { Template, CallToActionButton, QuickReplyButton } from '../../types';
import WhatsAppPreview from '../shared/WhatsAppPreview';
import SmsPreview from '../shared/SmsPreview';
import AppPreview from '../shared/AppPreview';
import { useToast } from '../../hooks/useToast';
import ConfirmationDialog from '../shared/ConfirmationDialog';

interface TemplateCreationScreenProps {
  templates?: Template[];
  setTemplates?: React.Dispatch<React.SetStateAction<Template[]>>;
  onSave: (template: Template) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

// --- SUB-COMPONENTS ---

const TemplateCard: React.FC<{ template: Template; onDelete: () => void; onEdit: () => void; onView: () => void; isSelected: boolean; }> = ({ template, onDelete, onEdit, onView, isSelected }) => {
    const categoryBorderColors: Record<Template['category'], string> = {
        Promotional: 'border-amber-400',
        Transactional: 'border-indigo-400',
        Welcome: 'border-emerald-400'
    };
    const categoryColors: Record<Template['category'], string> = {
        Promotional: 'bg-amber-100 text-amber-800',
        Transactional: 'bg-indigo-100 text-indigo-800',
        Welcome: 'bg-emerald-100 text-emerald-800'
    };

    return (
        <Card onClick={onView} className={`cursor-pointer flex flex-col p-0 overflow-hidden border-t-4 ${categoryBorderColors[template.category] || 'border-stone-400'} transition-all duration-200 ${isSelected ? 'ring-2 ring-emerald-500 shadow-lg' : 'hover:shadow-md hover:-translate-y-1'}`}>
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-stone-800 flex-grow pr-2">{template.name}</h3>
                    <StatusBadge status={template.status} />
                </div>
                <p className="text-sm text-stone-600 flex-grow mb-4 bg-stone-50 p-3 rounded-md line-clamp-3">{template.body}</p>
            </div>
            <div className="flex items-center justify-between mt-auto p-3 bg-stone-50/70 border-t border-stone-200">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[template.category] || 'bg-stone-100 text-stone-800'}`}>{template.category}</span>
                <div className="flex space-x-1">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-md" title="Edit"><PencilIcon className="w-5 h-5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md" title="Delete"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>
        </Card>
    );
}

const TemplatePreviewPanel: React.FC<{ template: Template, onClose: () => void }> = ({ template, onClose }) => {
    return (
        <Card className="sticky top-24">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Template Preview</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                    <CloseIcon className="w-6 h-6 text-stone-600" />
                </button>
            </div>
            <div className="flex items-center justify-center bg-stone-100 p-4 rounded-lg min-h-[550px]">
                {template.channel === 'WhatsApp' ? (
                    <div className="scale-90 origin-center">
                        <WhatsAppPreview
                            headerType={template.headerType}
                            headerText={template.headerText}
                            body={template.body}
                            footer={template.footer}
                            quickReplyButtons={template.buttonType === 'QUICK_REPLY' ? template.quickReplyButtons : []}
                            callToActionButtons={template.buttonType === 'CALL_TO_ACTION' ? template.callToActionButtons : []}
                        />
                    </div>
                ) : template.channel === 'SMS' ? (
                    <div className="scale-90 origin-center">
                        <SmsPreview
                            senderId={template.senderId}
                            body={template.body}
                        />
                    </div>
                ) : template.channel === 'AgroBEET Network' ? (
                    <div className="scale-90 origin-center">
                        <AppPreview
                            name={template.name}
                            body={template.body}
                            templateType={template.templateType}
                            placementType={template.placementType}
                        />
                    </div>
                ) : (
                    <div className="text-center p-4 bg-white rounded-lg border w-full">
                        <h4 className="font-bold">{template.name}</h4>
                        <div className="mt-4 text-sm text-stone-600 whitespace-pre-wrap bg-stone-50 p-3 rounded-md text-left">
                            <p>{template.body}</p>
                            {template.senderId && <p className="text-xs text-stone-400 mt-2">Sender ID: {template.senderId}</p>}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Channel', 'Setup', 'Content', 'Review'];
    return (
        <div className="flex items-center">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= index + 1 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'}`}>
                            {index + 1}
                        </div>
                        <span className={`ml-3 font-semibold hidden sm:inline ${currentStep >= index + 1 ? 'text-emerald-700' : 'text-stone-500'}`}>{step}</span>
                    </div>
                    {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const FileUploadZone: React.FC<{
    file: File | null;
    onFileChange: (file: File | null) => void;
    mediaType: 'Image' | 'Video' | 'Document';
}> = ({ file, onFileChange, mediaType }) => {
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    const acceptTypes = {
        Image: 'image/*',
        Video: 'video/*',
        Document: 'application/pdf',
    };

    return (
        <div className="mt-4">
            {!file ? (
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="text-center">
                        <UploadIcon className="w-8 h-8 mx-auto text-stone-400" />
                        <p className="mt-2 text-sm text-stone-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-stone-500">Select a {mediaType} file</p>
                    </div>
                    <input type="file" className="opacity-0 absolute inset-0" onChange={handleFileSelect} accept={acceptTypes[mediaType]} />
                </label>
            ) : (
                <div className="p-4 border border-stone-300 rounded-lg bg-stone-100 flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                         <DocumentIcon className="w-6 h-6 text-stone-600 flex-shrink-0" />
                         <p className="ml-3 text-sm font-medium text-stone-800 truncate">{file.name}</p>
                    </div>
                    <button onClick={() => onFileChange(null)} className="p-1 rounded-full hover:bg-stone-200 ml-2 flex-shrink-0">
                        <CloseIcon className="w-5 h-5 text-stone-600" />
                    </button>
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const TemplateCreationScreen: React.FC<TemplateCreationScreenProps> = ({ templates = [], setTemplates = () => {}, onSave, onCancel, isModal = false }) => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const { addToast } = useToast();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

    // List view State
    const [activeTab, setActiveTab] = useState<'WhatsApp' | 'SMS' | 'AgroBEET Network'>('WhatsApp');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<Template | null>(null);
    
    // Wizard State
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [templateData, setTemplateData] = useState<Omit<Template, 'id' | 'status'> & { [key: string]: any }>({
        name: '',
        category: 'Promotional',
        channel: 'WhatsApp',
        body: 'Hi {{1}}! We have an exciting offer for you.',
        // WhatsApp
        headerType: 'None',
        headerText: '',
        footer: '',
        buttonType: 'NONE',
        quickReplyButtons: [],
        callToActionButtons: [],
        whatsappBusinessAccountId: '',
        phoneNumberId: '',
        // SMS
        senderId: '',
        // AgroBEET Network
        agrobeetNetworkChannelId: '',
        language: '',
        placementType: 'Banner Ads',
        redirectUrl: '',
        duration: '',
        imageFile: null,
        videoFile: null,
    });
    
    useEffect(() => {
        if(isModal) {
            handleCreateClick();
        }
    }, [isModal]);

    const handleUpdate = (field: string, value: any) => {
        setTemplateData(prev => ({ ...prev, [field]: value }));
    };

    const handleButtonTypeChange = (type: 'NONE' | 'QUICK_REPLY' | 'CALL_TO_ACTION') => {
        handleUpdate('buttonType', type);
        // Reset buttons when type changes
        handleUpdate('quickReplyButtons', []);
        handleUpdate('callToActionButtons', []);
    };
    
    // --- Quick Reply Button Handlers ---
    const addQuickReply = () => {
        if (templateData.quickReplyButtons && templateData.quickReplyButtons.length < 3) {
            handleUpdate('quickReplyButtons', [...templateData.quickReplyButtons, { text: '' }]);
        }
    };
    const updateQuickReply = (index: number, text: string) => {
        const newButtons = [...(templateData.quickReplyButtons || [])];
        newButtons[index] = { text };
        handleUpdate('quickReplyButtons', newButtons);
    };
    const removeQuickReply = (index: number) => {
        handleUpdate('quickReplyButtons', (templateData.quickReplyButtons || []).filter((_, i) => i !== index));
    };

    // --- Call to Action Button Handlers ---
    const addCallToAction = () => {
        if (templateData.callToActionButtons && templateData.callToActionButtons.length < 2) {
            handleUpdate('callToActionButtons', [...templateData.callToActionButtons, { type: 'URL', text: '', value: '' }]);
        }
    };
    const updateCallToAction = (index: number, field: keyof CallToActionButton, value: string) => {
        const newButtons = [...(templateData.callToActionButtons || [])];
        newButtons[index] = { ...newButtons[index], [field]: value };
        handleUpdate('callToActionButtons', newButtons);
    };
    const removeCallToAction = (index: number) => {
        handleUpdate('callToActionButtons', (templateData.callToActionButtons || []).filter((_, i) => i !== index));
    };


    const resetWizard = () => {
        setCurrentStep(1);
        setTemplateData({
            name: '', category: 'Promotional', channel: 'WhatsApp',
            body: 'Hi {{1}}! We have an exciting offer for you.',
            headerType: 'None', headerText: '', footer: '',
            buttonType: 'NONE', quickReplyButtons: [], callToActionButtons: [],
            whatsappBusinessAccountId: '',
            phoneNumberId: '',
            senderId: '',
            agrobeetNetworkChannelId: '',
            language: '',
            placementType: 'Banner Ads',
            redirectUrl: '',
            duration: '',
            imageFile: null,
            videoFile: null,
        });
        setIsWizardOpen(false);
        setEditingTemplate(null);
    }

    const handleSave = () => {
        const isEditing = !!editingTemplate;
        const newTemplate: Template = isEditing ? {
            ...editingTemplate,
            ...templateData,
            status: 'Pending',
        } : {
            id: Date.now(),
            status: 'Pending',
            ...templateData,
            quickReplyButtons: templateData.quickReplyButtons || [],
            callToActionButtons: templateData.callToActionButtons || [],
        };
        
        onSave(newTemplate);
        
        if (!isModal) {
            resetWizard();
        }
    };

    const handleDeleteClick = (template: Template) => {
        setTemplateToDelete(template);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (templateToDelete) {
            setTemplates(templates.filter(t => t.id !== templateToDelete.id));
            addToast(`Template "${templateToDelete.name}" deleted.`, 'success');
            if (selectedTemplateForPreview?.id === templateToDelete.id) {
                setSelectedTemplateForPreview(null);
            }
        }
        setIsConfirmOpen(false);
        setTemplateToDelete(null);
    };

    const handleCreateClick = () => {
        setEditingTemplate(null);
        setTemplateData({
            name: '', category: 'Promotional', channel: 'WhatsApp',
            body: 'Hi {{1}}! We have an exciting offer for you.',
            headerType: 'None', headerText: '', footer: '',
            buttonType: 'NONE', quickReplyButtons: [], callToActionButtons: [],
            whatsappBusinessAccountId: '',
            phoneNumberId: '',
            senderId: '',
            agrobeetNetworkChannelId: '',
            language: '',
            placementType: 'Banner Ads',
            redirectUrl: '',
            duration: '',
            imageFile: null,
            videoFile: null,
        });
        setCurrentStep(1);
        setIsWizardOpen(true);
    };

    const handleEditClick = (template: Template) => {
        setEditingTemplate(template);
        setTemplateData({
            name: template.name,
            category: template.category,
            channel: template.channel,
            body: template.body,
            headerType: template.headerType || 'None',
            headerText: template.headerText || '',
            footer: template.footer || '',
            buttonType: template.buttonType || 'NONE',
            quickReplyButtons: template.quickReplyButtons || [],
            callToActionButtons: template.callToActionButtons || [],
            whatsappBusinessAccountId: 'waba_123',
            phoneNumberId: 'phone_id_1',
            senderId: template.senderId || 'AGROBT',
            agrobeetNetworkChannelId: 'nc_1',
            language: template.language || 'en',
            placementType: template.placementType || 'Banner Ads',
            redirectUrl: '',
            duration: '',
            imageFile: null,
            videoFile: null,
        });
        setCurrentStep(2);
        setIsWizardOpen(true);
    };
    
    const canProceed = () => {
        if (currentStep === 1) return templateData.channel;
        if (currentStep === 2) {
            if (!templateData.name || !templateData.category) return false;
            if (templateData.channel === 'WhatsApp') {
                return templateData.whatsappBusinessAccountId && templateData.phoneNumberId;
            }
            if (templateData.channel === 'SMS') {
                return templateData.senderId;
            }
            if (templateData.channel === 'AgroBEET Network') {
                return templateData.agrobeetNetworkChannelId && templateData.language;
            }
            return true;
        }
        if (currentStep === 3) return templateData.body;
        return true;
    }

    // Memoized filtering and pagination
    const filteredTemplates = useMemo(() => {
        return templates
            .filter(t => t.channel === activeTab)
            .filter(t => statusFilter === 'All' || t.status === statusFilter)
            .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [templates, activeTab, statusFilter, searchTerm]);

    const paginatedTemplates = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredTemplates.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredTemplates, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage);

    const handleTabClick = (tab: 'WhatsApp' | 'SMS' | 'AgroBEET Network') => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset page on tab change
        setSelectedTemplateForPreview(null); // Close preview on tab change
    };
    
    const totalCount = useMemo(() => {
        const counts = {
            WhatsApp: 0,
            SMS: 0,
            'AgroBEET Network': 0,
            Total: 0,
        };
        templates.forEach(t => {
            if (t.channel in counts) {
                counts[t.channel as keyof typeof counts]++;
            }
            counts.Total++;
        });
        return counts;
    }, [templates]);

    const handleCancel = () => {
        if(onCancel) {
            onCancel();
        } else {
            resetWizard();
        }
    }


  const mainContent = (
    <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h2 className="text-3xl font-bold text-stone-800">Message Templates</h2>
                <p className="text-stone-500 mt-1">Design and manage reusable messages for your campaigns.</p>
            </div>
             <div>
                <Button icon={<PlusIcon />} onClick={handleCreateClick}>Create Template</Button>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-stone-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <TabButton name="WhatsApp" count={totalCount.WhatsApp} isActive={activeTab === 'WhatsApp'} onClick={() => handleTabClick('WhatsApp')} />
                <TabButton name="SMS" count={totalCount.SMS} isActive={activeTab === 'SMS'} onClick={() => handleTabClick('SMS')} />
                <TabButton name="AgroBEET Network" count={totalCount['AgroBEET Network']} isActive={activeTab === 'AgroBEET Network'} onClick={() => handleTabClick('AgroBEET Network')} />
                <TabButton name="Total" count={totalCount.Total} isActive={false} onClick={() => {}} isTotal />
            </nav>
        </div>

        {/* Filters and Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow">
                 <Card className="p-0 overflow-hidden h-full flex flex-col">
                    <div className="p-4 flex flex-wrap gap-4 items-center border-b border-stone-200">
                        <div className="relative flex-grow min-w-[200px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-stone-400" />
                            </div>
                            <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
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
                            <option value="All">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="flex-grow">
                        {paginatedTemplates.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-stone-500 font-semibold">No data found</p>
                                <p className="text-sm text-stone-400 mt-1">There are no templates matching your current filters.</p>
                            </div>
                        ) : (
                            <div className={`p-6 grid grid-cols-1 md:grid-cols-2 ${selectedTemplateForPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                                {paginatedTemplates.map(template => (
                                    <TemplateCard 
                                      key={template.id} 
                                      template={template} 
                                      onView={() => setSelectedTemplateForPreview(template)}
                                      isSelected={selectedTemplateForPreview?.id === template.id}
                                      onEdit={() => handleEditClick(template)} 
                                      onDelete={() => handleDeleteClick(template)} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                        {paginatedTemplates.length > 0 && (
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
                                    {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, filteredTemplates.length)} of {filteredTemplates.length}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="p-2" disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </Button>
                                    <div className="text-sm font-medium px-2">
                                        <input
                                            type="number"
                                            value={currentPage}
                                            onChange={(e) => {
                                                const page = e.target.value ? Number(e.target.value) : 1;
                                                if(page > 0 && page <= totalPages) setCurrentPage(page);
                                            }}
                                            className="w-12 text-center bg-stone-100 rounded-md border border-stone-300"
                                        />
                                        / {totalPages}
                                    </div>
                                    <Button variant="outline" className="p-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Button>
                                </div>
                            </div>
                        )}
                </Card>
            </div>
            {selectedTemplateForPreview && (
                 <div className="w-full lg:w-[380px] flex-shrink-0">
                    <TemplatePreviewPanel template={selectedTemplateForPreview} onClose={() => setSelectedTemplateForPreview(null)} />
                </div>
            )}
        </div>
    </div>
  );


  return (
    <>
    {!isModal && mainContent}
    
    {/* Creation Wizard */}
    {isWizardOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true">
            <div className="bg-stone-50 rounded-2xl shadow-2xl w-full h-full flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b border-stone-200 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">{editingTemplate ? 'Edit Template' : 'Create New Template'}</h2>
                        <p className="text-sm text-stone-500">Step {currentStep} of 4</p>
                    </div>
                    <button onClick={handleCancel} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-6 h-6 text-stone-600" />
                    </button>
                </header>

                <div className="p-4 sm:p-6 flex-shrink-0 border-b border-stone-200">
                    <Stepper currentStep={currentStep} />
                </div>

                <div className="flex-grow flex flex-col md:flex-row overflow-y-auto min-h-0">
                    {/* Form Section */}
                    <div className={`p-6 space-y-6 overflow-y-auto ${currentStep > 1 ? 'w-full md:w-3/5' : 'w-full flex items-center justify-center'}`}>
                        {currentStep === 1 && (
                            <div className="space-y-6 max-w-lg w-full">
                                <h3 className="text-xl font-bold">1. Choose a Channel</h3>
                                <p className="text-stone-500">Select the channel you want to create a template for.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <ChannelCard icon={<WhatsAppIcon className="w-8 h-8 text-emerald-600" />} title="WhatsApp" onClick={() => handleUpdate('channel', 'WhatsApp')} isSelected={templateData.channel === 'WhatsApp'} />
                                    <ChannelCard icon={<SmsIcon className="w-8 h-8 text-slate-600" />} title="SMS" onClick={() => handleUpdate('channel', 'SMS')} isSelected={templateData.channel === 'SMS'} />
                                    <ChannelCard icon={<AppIcon className="w-8 h-8 text-blue-600" />} title="AgroBEET Network" onClick={() => handleUpdate('channel', 'AgroBEET Network')} isSelected={templateData.channel === 'AgroBEET Network'} />
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="space-y-6 max-w-lg">
                                <h3 className="text-xl font-bold">2. Setup</h3>
                                <div>
                                    <label htmlFor="templateName" className="block text-sm font-medium text-stone-700 mb-1">Template Name</label>
                                    <input type="text" id="templateName" placeholder="e.g., Welcome Discount" value={templateData.name} onChange={e => handleUpdate('name', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                </div>
                                
                                {templateData.channel === 'WhatsApp' && (
                                    <>
                                        <div>
                                            <label htmlFor="waba" className="block text-sm font-medium text-stone-700 mb-1">WhatsApp Business Account</label>
                                            <select id="waba" value={templateData.whatsappBusinessAccountId} onChange={e => handleUpdate('whatsappBusinessAccountId', e.target.value)} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                <option value="">Select Business Account</option>
                                                <option value="waba_123">Appleseed Farms Inc.</option>
                                                <option value="waba_456">AgroBEET Promotions</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                                            <select id="phoneNumber" value={templateData.phoneNumberId} onChange={e => handleUpdate('phoneNumberId', e.target.value)} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                <option value="">Select Phone Number</option>
                                                <option value="phone_id_1">+91 98765 43210 (Marketing)</option>
                                                <option value="phone_id_2">+91 98765 43211 (Support)</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {templateData.channel === 'SMS' && (
                                    <div>
                                        <label htmlFor="senderId" className="block text-sm font-medium text-stone-700 mb-1">SMS Sender ID</label>
                                        <select id="senderId" value={templateData.senderId} onChange={e => handleUpdate('senderId', e.target.value)} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                            <option value="">Select Sender ID</option>
                                            <option value="AGROBT">AGROBT</option>
                                            <option value="AGRO-TX">AGRO-TX</option>
                                        </select>
                                    </div>
                                )}
                                
                                {templateData.channel === 'AgroBEET Network' && (
                                    <>
                                        <div>
                                            <label htmlFor="networkChannel" className="block text-sm font-medium text-stone-700 mb-1">AgroBEET Network Channel</label>
                                            <select id="networkChannel" value={templateData.agrobeetNetworkChannelId} onChange={e => handleUpdate('agrobeetNetworkChannelId', e.target.value)} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                <option value="">Select Network Channel</option>
                                                <option value="nc_1">App Main Feed</option>
                                                <option value="nc_2">Promotions Section</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="language" className="block text-sm font-medium text-stone-700 mb-1">Language</label>
                                            <select id="language" value={templateData.language} onChange={e => handleUpdate('language', e.target.value)} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                <option value="">Select Language</option>
                                                <option value="en">English</option>
                                                <option value="hi">Hindi</option>
                                                <option value="pa">Punjabi</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                                    <select id="category" value={templateData.category} onChange={e => handleUpdate('category', e.target.value as Template['category'])} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option>Promotional</option>
                                        <option>Transactional</option>
                                        <option>Welcome</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                             <div className="space-y-6">
                                <h3 className="text-xl font-bold">3. Content</h3>
                                
                                {templateData.channel === 'AgroBEET Network' && (
                                    <div className="space-y-4">
                                        <Card className="p-4">
                                            <label htmlFor="placementType" className="block text-sm font-medium text-stone-700 mb-1">Placement Type</label>
                                            <select id="placementType" value={templateData.placementType} onChange={e => handleUpdate('placementType', e.target.value)} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                <option>Banner Ads</option>
                                                <option>Modal Popup</option>
                                                <option>Push Notification</option>
                                                <option>Home Screen</option>
                                            </select>
                                        </Card>
                                        <Card className="p-4">
                                            <label htmlFor="redirectUrl" className="block text-sm font-medium text-stone-700 mb-1">Redirect URL (Optional)</label>
                                            <input type="url" id="redirectUrl" placeholder="https://example.com/offer" value={templateData.redirectUrl} onChange={e => handleUpdate('redirectUrl', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                        </Card>
                                        <Card className="p-4">
                                            <label htmlFor="duration" className="block text-sm font-medium text-stone-700 mb-1">Duration (Optional)</label>
                                            <input type="text" id="duration" placeholder="e.g., 7 days" value={templateData.duration} onChange={e => handleUpdate('duration', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                        </Card>
                                        <Card className="p-4">
                                            <label className="block text-sm font-medium text-stone-700">Image (Optional)</label>
                                            <FileUploadZone file={templateData.imageFile} onFileChange={(file) => handleUpdate('imageFile', file)} mediaType="Image" />
                                        </Card>
                                        <Card className="p-4">
                                            <label className="block text-sm font-medium text-stone-700">Video (Optional)</label>
                                            <FileUploadZone file={templateData.videoFile} onFileChange={(file) => handleUpdate('videoFile', file)} mediaType="Video" />
                                        </Card>
                                    </div>
                                )}

                                <Card className="p-4">
                                    <label htmlFor="messageBody" className="block text-sm font-medium text-stone-700 mb-1">{templateData.channel === 'AgroBEET Network' ? 'Description' : 'Body'}</label>
                                    <textarea id="messageBody" rows={6} value={templateData.body} onChange={e => handleUpdate('body', e.target.value)} placeholder="Enter your message here..." className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"></textarea>
                                    {templateData.channel === 'WhatsApp' && <p className="text-xs text-stone-500 mt-2">Use `{'{{1}}'}`, `{'{{2}}'}` for variables.</p>}
                                </Card>
                                
                                {templateData.channel === 'WhatsApp' && (
                                    <>
                                        <Card className="p-4">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Header (Optional)</label>
                                            <div className="flex space-x-2">
                                                {(['None', 'Text', 'Image', 'Video', 'Document'] as const).map(type => (
                                                    <button key={type} onClick={() => handleUpdate('headerType', type)} className={`px-3 py-1.5 text-sm rounded-md ${templateData.headerType === type ? 'bg-emerald-600 text-white' : 'bg-stone-200 hover:bg-stone-300'}`}>{type}</button>
                                                ))}
                                            </div>
                                            {templateData.headerType === 'Text' && <input type="text" placeholder="Enter header text... (e.g., Welcome!)" value={templateData.headerText} onChange={e => handleUpdate('headerText', e.target.value)} className="mt-3 w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>}
                                            {(templateData.headerType === 'Image' || templateData.headerType === 'Video' || templateData.headerType === 'Document') && templateData.headerType && (
                                                <FileUploadZone file={null} onFileChange={(file) => { /* Not implemented for preview */ }} mediaType={templateData.headerType} />
                                            )}
                                        </Card>
                                        <Card className="p-4">
                                            <label htmlFor="footer" className="block text-sm font-medium text-stone-700 mb-1">Footer (Optional)</label>
                                            <input type="text" id="footer" placeholder="e.g., Not you? Unsubscribe." value={templateData.footer} onChange={e => handleUpdate('footer', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                        </Card>

                                        <Card className="p-4">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Buttons (Optional)</label>
                                            <p className="text-xs text-stone-500 mb-2">Note: WhatsApp allows either up to 3 Quick Reply buttons OR up to 2 Call to Action buttons, not both.</p>
                                            <div className="flex space-x-2 border-b border-stone-200 pb-3 mb-3">
                                                {(['NONE', 'QUICK_REPLY', 'CALL_TO_ACTION'] as const).map(type => (
                                                    <button key={type} onClick={() => handleButtonTypeChange(type)} className={`px-3 py-1.5 text-sm rounded-md ${templateData.buttonType === type ? 'bg-emerald-600 text-white' : 'bg-stone-200 hover:bg-stone-300'}`}>{type.replace('_', ' ')}</button>
                                                ))}
                                            </div>
                                            
                                            {templateData.buttonType === 'QUICK_REPLY' && <div className="space-y-3">
                                                {(templateData.quickReplyButtons || []).map((btn, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <input type="text" placeholder={`Reply ${index + 1}`} value={btn.text} onChange={(e) => updateQuickReply(index, e.target.value)} className="flex-grow px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                                        <button onClick={() => removeQuickReply(index)}><TrashIcon className="w-5 h-5 text-red-500"/></button>
                                                    </div>
                                                ))}
                                                {(templateData.quickReplyButtons?.length || 0) < 3 && <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={addQuickReply} icon={<PlusIcon />}>Add Reply</Button>}
                                            </div>}
                                            
                                            {templateData.buttonType === 'CALL_TO_ACTION' && <div className="space-y-3">
                                                {(templateData.callToActionButtons || []).map((btn, index) => (
                                                    <div key={index} className="p-3 bg-stone-100 rounded-lg space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold text-sm">Button {index + 1}</p>
                                                            <button onClick={() => removeCallToAction(index)}><TrashIcon className="w-5 h-5 text-red-500"/></button>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <select value={btn.type} onChange={e => updateCallToAction(index, 'type', e.target.value as CallToActionButton['type'])} className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                                <option value="URL">Visit Website</option>
                                                                <option value="PHONE_NUMBER">Call Phone</option>
                                                            </select>
                                                            <input type="text" placeholder="Button Text" value={btn.text} onChange={e => updateCallToAction(index, 'text', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                                        </div>
                                                        <input type="text" placeholder={btn.type === 'URL' ? 'https://example.com' : '+1234567890'} value={btn.value} onChange={e => updateCallToAction(index, 'value', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                                    </div>
                                                ))}
                                                {(templateData.callToActionButtons?.length || 0) < 2 && <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={addCallToAction} icon={<PlusIcon />}>Add Button</Button>}
                                            </div>}
                                        </Card>
                                    </>
                                )}
                            </div>
                        )}
                        {currentStep === 4 && (
                             <div className="space-y-4 max-w-lg">
                                <h3 className="text-xl font-bold">4. Review</h3>
                                <p className="text-stone-500">Please review your template before saving.</p>
                                <div className="space-y-2 bg-white p-4 rounded-lg border">
                                    <p><strong>Name:</strong> {templateData.name}</p>
                                    <p><strong>Category:</strong> {templateData.category}</p>
                                    <p><strong>Channel:</strong> {templateData.channel}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    {currentStep > 1 && (
                        <div className="w-full md:w-2/5 bg-stone-200 p-2 sm:p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-stone-300 overflow-y-auto">
                           <div className="h-[50vh] flex items-center justify-center">
                               <div className="transform scale-75 origin-center">
                                   {templateData.channel === 'WhatsApp' ? (
                                        <WhatsAppPreview
                                            headerType={templateData.headerType}
                                            headerText={templateData.headerText}
                                            body={templateData.body}
                                            footer={templateData.footer}
                                            quickReplyButtons={templateData.buttonType === 'QUICK_REPLY' ? templateData.quickReplyButtons : []}
                                            callToActionButtons={templateData.buttonType === 'CALL_TO_ACTION' ? templateData.callToActionButtons : []}
                                        />
                                   ) : templateData.channel === 'SMS' ? (
                                       <SmsPreview body={templateData.body} senderId={templateData.senderId} />
                                   ) : templateData.channel === 'AgroBEET Network' ? (
                                       <AppPreview
                                           name={templateData.name}
                                           body={templateData.body}
                                           templateType={templateData.placementType === 'Push Notification' ? 'Push Notification' : 'In-App Message'}
                                           placementType={templateData.placementType}
                                           imageFile={templateData.imageFile}
                                           videoFile={templateData.videoFile}
                                       />
                                   ) : (
                                       <div className="text-center text-stone-600 bg-white p-8 rounded-lg shadow-md">
                                           <p className="font-semibold">Live preview is only available for WhatsApp and SMS.</p>
                                           <div className="mt-4 p-4 border rounded-md text-left bg-stone-50">
                                               <p className="text-sm whitespace-pre-wrap">{templateData.body}</p>
                                           </div>
                                       </div>
                                   )}
                               </div>
                           </div>
                        </div>
                    )}
                </div>

                <footer className="flex justify-between p-4 border-t border-stone-200 bg-white/50 flex-shrink-0">
                    <Button variant="outline" onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)} disabled={currentStep === 1 || (!!editingTemplate && currentStep === 2)}>Back</Button>
                    <div className="space-x-3">
                         <Button variant="outline" onClick={handleCancel}>
                           {isModal ? 'Cancel' : 'Close'}
                         </Button>
                         {currentStep < 4 ? (
                            <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>Next</Button>
                         ) : (
                            <Button onClick={handleSave}>{editingTemplate ? 'Update Template' : 'Save Template'}</Button>
                         )}
                    </div>
                </footer>
            </div>
        </div>
    )}
    <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Template"
        message={`Are you sure you want to delete the template "${templateToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </>
  );
};


const TabButton: React.FC<{ name: string; count: number; isActive: boolean; onClick: () => void; isTotal?: boolean; }> = ({ name, count, isActive, onClick, isTotal = false }) => (
    <button
        onClick={onClick}
        disabled={isTotal}
        className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            isActive
                ? 'border-emerald-600 text-emerald-600'
                : isTotal 
                ? 'border-transparent text-stone-800 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
        }`}
    >
        {name}
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
            {count}
        </span>
    </button>
);

const StatusBadge: React.FC<{ status: Template['status'] }> = ({ status }) => {
    const statusClasses: Record<Template['status'], string> = {
        Approved: 'bg-emerald-100 text-emerald-800',
        Pending: 'bg-amber-100 text-amber-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
            {status.toUpperCase()}
        </span>
    );
};

const ChannelCard: React.FC<{icon: React.ReactNode, title: string, isSelected: boolean, onClick: () => void}> = ({ icon, title, isSelected, onClick }) => (
    <div onClick={onClick} className={`p-6 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 hover:border-emerald-400'}`}>
        <div className="mb-2">{icon}</div>
        <p className="font-semibold text-stone-700">{title}</p>
    </div>
);


export default TemplateCreationScreen;