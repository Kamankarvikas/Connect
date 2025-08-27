import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, ArrowLeftIcon, WhatsAppIcon, ClockIcon, BranchIcon, SmsIcon } from '../Icons';

// Mock Data
const MOCK_AUTOMATIONS = [
    {
        id: 1,
        name: 'New Subscriber Welcome Series',
        status: 'Active',
        enrolled: 1256,
        conversionRate: 14.2,
    },
    {
        id: 2,
        name: 'Abandoned Cart Reminder',
        status: 'Draft',
        enrolled: 0,
        conversionRate: 0,
    },
    {
        id: 3,
        name: 'Post-Purchase Follow-up',
        status: 'Paused',
        enrolled: 842,
        conversionRate: 8.9,
    },
];

const WELCOME_SERIES_WORKFLOW = {
    trigger: { type: 'User Subscribes', details: 'To list "All Farmers"' },
    steps: [
        { type: 'Send WhatsApp Message', details: 'Template: "Welcome New Customer"', icon: <WhatsAppIcon className="w-5 h-5 text-white"/>, color: 'bg-emerald-500' },
        { type: 'Wait', details: '3 Days', icon: <ClockIcon className="w-5 h-5 text-white"/>, color: 'bg-sky-500' },
        { type: 'If/Else Branch', details: 'Contact clicked link in previous message?', icon: <BranchIcon className="w-5 h-5 text-white"/>, color: 'bg-amber-500' },
        { type: 'Send SMS Message', details: 'Template: "Special Discount Offer"', branch: 'Yes', icon: <SmsIcon className="w-5 h-5 text-white"/>, color: 'bg-slate-500' },
        { type: 'Send WhatsApp Message', details: 'Template: "Did you see our new seeds?"', branch: 'No', icon: <WhatsAppIcon className="w-5 h-5 text-white"/>, color: 'bg-emerald-500' },
    ]
};


const AutomationsScreen: React.FC = () => {
    const [selectedAutomation, setSelectedAutomation] = useState<any | null>(null);

    if (selectedAutomation) {
        return <AutomationDetailView automation={selectedAutomation} onBack={() => setSelectedAutomation(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-stone-800">Automations</h2>
                    <p className="text-stone-500 mt-1">Create and manage your automated customer journeys.</p>
                </div>
                <Button icon={<PlusIcon />}>Create New Workflow</Button>
            </div>

            <Card className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="border-b-2 border-stone-200 text-xs text-stone-500 uppercase">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-semibold">Workflow Name</th>
                            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                            <th scope="col" className="px-5 py-3 font-semibold text-right">Contacts Enrolled</th>
                            <th scope="col" className="px-5 py-3 font-semibold text-right">Conversion Rate</th>
                            <th scope="col" className="px-5 py-3 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_AUTOMATIONS.map(flow => <AutomationRow key={flow.id} automation={flow} onView={() => setSelectedAutomation(flow)} />)}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

// Sub-components for the main screen
const AutomationRow: React.FC<{ automation: any, onView: () => void }> = ({ automation, onView }) => {
    const statusClasses = {
        Active: 'bg-emerald-100 text-emerald-800',
        Draft: 'bg-stone-200 text-stone-800',
        Paused: 'bg-amber-100 text-amber-800',
    };

    return (
        <tr className="border-b border-stone-200 hover:bg-stone-50/80 transition-colors">
            <td className="px-5 py-4 font-medium text-stone-800">{automation.name}</td>
            <td className="px-5 py-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[automation.status]}`}>
                    {automation.status}
                </span>
            </td>
            <td className="px-5 py-4 text-stone-600 text-right">{automation.enrolled.toLocaleString()}</td>
            <td className="px-5 py-4 text-stone-600 text-right">{automation.conversionRate.toFixed(1)}%</td>
            <td className="px-5 py-4 text-right">
                <Button variant="outline" className="py-1 px-3" onClick={onView}>View Workflow</Button>
            </td>
        </tr>
    );
}

// Sub-component for the detail view
const AutomationDetailView: React.FC<{ automation: any, onBack: () => void }> = ({ automation, onBack }) => {
    return (
         <div className="space-y-6">
            <Button variant="outline" className="mb-2" onClick={onBack}>
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to All Automations
            </Button>
            <div>
                <h2 className="text-3xl font-bold text-stone-800">{automation.name}</h2>
                <p className="text-stone-500 mt-1">Visualizing the customer journey for this workflow.</p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-stone-200/80 shadow-sm flex justify-center">
                <div className="inline-flex flex-col items-center">
                    {/* Trigger Node */}
                    <div className="bg-white border-2 border-emerald-500 rounded-lg p-4 w-72 text-center shadow-lg">
                        <p className="font-bold text-emerald-700">TRIGGER</p>
                        <p className="text-stone-600 text-sm">{WELCOME_SERIES_WORKFLOW.trigger.type}</p>
                        <p className="text-xs text-stone-400 mt-1">{WELCOME_SERIES_WORKFLOW.trigger.details}</p>
                    </div>

                    {/* Steps */}
                    {WELCOME_SERIES_WORKFLOW.steps.map((step, index) => (
                       <React.Fragment key={index}>
                           <div className="h-8 w-0.5 bg-stone-300 my-2" />
                           {step.branch && (
                                <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full mb-2">
                                    {step.branch === 'Yes' ? 'PATH A: YES' : 'PATH B: NO'}
                                </div>
                           )}
                           <div className={`rounded-lg p-3 w-72 text-left shadow-md flex items-center text-white ${step.color}`}>
                               <div className="p-2 rounded-full bg-black/20 mr-3">
                                   {step.icon}
                               </div>
                               <div>
                                   <p className="font-semibold text-sm">{step.type}</p>
                                   <p className="text-xs opacity-80">{step.details}</p>
                               </div>
                           </div>
                       </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default AutomationsScreen;