import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useToast } from '../../hooks/useToast';
import { UploadIcon, DocumentIcon, CloseIcon } from '../Icons';

interface OnboardingScreenProps {
  onOnboardingComplete: () => void;
}

// --- SUB-COMPONENTS for the form ---

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Company Info', 'Address', 'Documents'];
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

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        <input 
            id={id} 
            {...props} 
            className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-emerald-500'}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const DocumentUpload: React.FC<{
    docName: string;
    number: string;
    file: File | null;
    onNumberChange: (value: string) => void;
    onFileChange: (file: File | null) => void;
}> = ({ docName, number, file, onNumberChange, onFileChange }) => {
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-3 p-4 bg-stone-100/80 border border-stone-200/80 rounded-lg">
            <h4 className="font-semibold text-stone-800">{docName}</h4>
            <InputField label={`${docName} Number`} id={docName.toLowerCase()} value={number} onChange={e => onNumberChange(e.target.value)} placeholder={`Enter ${docName} Number`} />
            {!file ? (
                <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="text-center">
                        <UploadIcon className="w-6 h-6 mx-auto text-stone-400" />
                        <p className="mt-1 text-sm text-stone-600">Upload {docName} File/Photo</p>
                    </div>
                    <input type="file" className="opacity-0 absolute inset-0" onChange={handleFileSelect} accept="image/*,application/pdf" />
                </label>
            ) : (
                <div className="p-3 border border-stone-300 rounded-lg bg-emerald-50/50 flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                         <DocumentIcon className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                         <p className="ml-2 text-sm font-medium text-emerald-900 truncate" title={file.name}>{file.name}</p>
                    </div>
                    <button onClick={() => onFileChange(null)} className="p-1 rounded-full hover:bg-stone-200 ml-2 flex-shrink-0">
                        <CloseIcon className="w-4 h-4 text-stone-600" />
                    </button>
                </div>
            )}
        </div>
    );
};


// --- MAIN ONBOARDING SCREEN ---

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onOnboardingComplete }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { addToast } = useToast();
    const [isFinishing, setIsFinishing] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        companyUrl: '',
        country: 'India',
        state: '',
        district: '',
        subDistrict: '',
        village: '',
        address: '',
        gstinNumber: '',
        gstinFile: null as File | null,
        cinNumber: '',
        cinFile: null as File | null,
        panNumber: '',
        panFile: null as File | null,
    });

    const handleNext = () => {
        // Add validation logic here if needed before proceeding
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        // Add final validation here
        setIsFinishing(true);
        setTimeout(() => {
            setIsFinishing(false);
            addToast('Onboarding completed successfully!', 'success');
            onOnboardingComplete();
        }, 1500);
    };

    const handleUpdate = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                 <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
                        Welcome to <span className="text-emerald-600">Agro</span><span className="text-amber-500">BEET</span> Connect
                    </h1>
                    <p className="text-stone-500 mt-1">Let's get your account set up. Please provide some details about your business.</p>
                </div>

                <Card className="p-0 overflow-hidden">
                    <header className="p-5 border-b border-stone-200">
                        <Stepper currentStep={currentStep} />
                    </header>

                    <div className="p-6 space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <h3 className="text-xl font-bold">Company Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Company Name" id="companyName" value={formData.companyName} onChange={e => handleUpdate('companyName', e.target.value)} />
                                    <InputField label="Company Email" id="companyEmail" type="email" value={formData.companyEmail} onChange={e => handleUpdate('companyEmail', e.target.value)} />
                                    <InputField label="Company Phone" id="companyPhone" type="tel" value={formData.companyPhone} onChange={e => handleUpdate('companyPhone', e.target.value)} />
                                    <InputField label="Website URL" id="companyUrl" type="url" value={formData.companyUrl} onChange={e => handleUpdate('companyUrl', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                             <div className="space-y-4 animate-fade-in">
                                <h3 className="text-xl font-bold">Address Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InputField label="Country" id="country" value={formData.country} onChange={e => handleUpdate('country', e.target.value)} />
                                    <InputField label="State" id="state" value={formData.state} onChange={e => handleUpdate('state', e.target.value)} />
                                    <InputField label="District" id="district" value={formData.district} onChange={e => handleUpdate('district', e.target.value)} />
                                    <InputField label="Sub-District" id="subDistrict" value={formData.subDistrict} onChange={e => handleUpdate('subDistrict', e.target.value)} />
                                    <InputField label="Village / Town" id="village" value={formData.village} onChange={e => handleUpdate('village', e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-stone-700 mb-1">Full Address</label>
                                    <textarea id="address" value={formData.address} onChange={e => handleUpdate('address', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                             <div className="space-y-4 animate-fade-in">
                                <h3 className="text-xl font-bold">Company Documents</h3>
                                <p className="text-sm text-stone-500">Please provide your business identification documents. You can upload a clear photo or a PDF file.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <DocumentUpload docName="GSTIN" number={formData.gstinNumber} file={formData.gstinFile} onNumberChange={v => handleUpdate('gstinNumber', v)} onFileChange={f => handleUpdate('gstinFile', f)} />
                                    <DocumentUpload docName="CIN" number={formData.cinNumber} file={formData.cinFile} onNumberChange={v => handleUpdate('cinNumber', v)} onFileChange={f => handleUpdate('cinFile', f)} />
                                    <DocumentUpload docName="PAN" number={formData.panNumber} file={formData.panFile} onNumberChange={v => handleUpdate('panNumber', v)} onFileChange={f => handleUpdate('panFile', f)} />
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className="flex justify-between items-center p-4 bg-stone-50/80 border-t border-stone-200">
                        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>Back</Button>
                        {currentStep < 3 ? (
                            <Button onClick={handleNext}>Next</Button>
                        ) : (
                            <Button onClick={handleFinish} loading={isFinishing}>Finish Setup</Button>
                        )}
                    </footer>
                </Card>
            </div>
        </div>
    );
};

export default OnboardingScreen;
