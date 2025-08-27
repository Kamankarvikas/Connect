import React from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { MOCK_COMPANY_PROFILE } from '../../constants';
import { BuildingOfficeIcon, MapPinIcon, DocumentTextIcon, PencilIcon, LinkIcon, PhoneIcon } from '../Icons';

const InfoItem: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div>
        <dt className="text-sm font-medium text-stone-500 flex items-center">
            {icon && <span className="mr-2 w-4 h-4">{icon}</span>}
            {label}
        </dt>
        <dd className="mt-1 text-base text-stone-800 font-semibold">{value}</dd>
    </div>
);

const DocumentItem: React.FC<{ name: string; number: string; fileName: string; fileUrl: string }> = ({ name, number, fileName, fileUrl }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="min-w-0">
            <p className="font-semibold text-stone-800 truncate">{name}</p>
            <p className="text-sm text-stone-600 font-mono truncate">{number}</p>
        </div>
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex-shrink-0">
            <Button variant="outline" className="text-sm w-full sm:w-auto">View Document</Button>
        </a>
    </div>
);

const CompanyProfileScreen: React.FC = () => {
    const profile = MOCK_COMPANY_PROFILE;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-stone-800">Company Profile</h2>
                    <p className="text-stone-500 mt-1">Review your business information and legal documents.</p>
                </div>
                <Button variant="outline" icon={<PencilIcon className="w-5 h-5"/>}>
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Company Information Card */}
                    <Card>
                        <div className="flex items-center border-b border-stone-200 pb-4 mb-6">
                            <BuildingOfficeIcon className="w-6 h-6 mr-3 text-emerald-600" />
                            <h3 className="text-xl font-bold">Company Information</h3>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                            <InfoItem label="Company Name" value={profile.info.name} />
                            <InfoItem label="Email Address" value={profile.info.email} />
                            <InfoItem label="Phone Number" value={profile.info.phone} icon={<PhoneIcon />} />
                            <InfoItem label="Website URL" value={profile.info.url} icon={<LinkIcon />} />
                        </dl>
                    </Card>

                    {/* Address Details Card */}
                    <Card>
                        <div className="flex items-center border-b border-stone-200 pb-4 mb-6">
                            <MapPinIcon className="w-6 h-6 mr-3 text-emerald-600" />
                            <h3 className="text-xl font-bold">Address Details</h3>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                            <InfoItem label="Country" value={profile.address.country} />
                            <InfoItem label="State" value={profile.address.state} />
                            <InfoItem label="District" value={profile.address.district} />
                            <InfoItem label="Sub-District" value={profile.address.subDistrict} />
                            <InfoItem label="Village / Town" value={profile.address.village} />
                        </dl>
                        <div className="mt-8 border-t border-stone-200 pt-6">
                             <InfoItem label="Full Address" value={profile.address.fullAddress} />
                        </div>
                    </Card>
                </div>
                
                {/* Documents Card */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <div className="flex items-center border-b border-stone-200 pb-4 mb-6">
                            <DocumentTextIcon className="w-6 h-6 mr-3 text-emerald-600" />
                            <h3 className="text-xl font-bold">Documents</h3>
                        </div>
                        <div className="space-y-4">
                            <DocumentItem 
                                name="GSTIN" 
                                number={profile.documents.gstin.number}
                                fileName={profile.documents.gstin.file.name}
                                fileUrl={profile.documents.gstin.file.url}
                            />
                            <DocumentItem 
                                name="CIN" 
                                number={profile.documents.cin.number}
                                fileName={profile.documents.cin.file.name}
                                fileUrl={profile.documents.cin.file.url}
                            />
                             <DocumentItem 
                                name="PAN" 
                                number={profile.documents.pan.number}
                                fileName={profile.documents.pan.file.name}
                                fileUrl={profile.documents.pan.file.url}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileScreen;
