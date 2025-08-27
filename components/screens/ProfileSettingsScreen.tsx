import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useToast } from '../../hooks/useToast';

const InputField: React.FC<{ label: string; id: string; type: string; defaultValue: string; placeholder?: string }> = ({ label, id, type, defaultValue, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        <input 
            type={type} 
            id={id} 
            defaultValue={defaultValue} 
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        />
    </div>
);

const ProfileSettingsScreen: React.FC = () => {
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            addToast('Profile updated successfully!', 'success');
        }, 1000);
    };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div>
            <h2 className="text-3xl font-bold text-stone-800">Personal Settings</h2>
            <p className="text-stone-500 mt-1">Update your personal information and account details.</p>
        </div>

        <Card>
            <h3 className="text-xl font-bold border-b border-stone-200 pb-4 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Full Name" id="fullName" type="text" defaultValue="John Appleseed" />
                <InputField label="Email Address" id="email" type="email" defaultValue="john.appleseed@example.com" />
            </div>
        </Card>

        <Card>
            <h3 className="text-xl font-bold border-b border-stone-200 pb-4 mb-6">Change Password</h3>
            <div className="space-y-6">
                {/* FIX: Added missing defaultValue prop to satisfy the InputField component's required props. */}
                <InputField label="Current Password" id="currentPassword" type="password" defaultValue="" placeholder="••••••••" />
                {/* FIX: Added missing defaultValue prop to satisfy the InputField component's required props. */}
                <InputField label="New Password" id="newPassword" type="password" defaultValue="" placeholder="••••••••" />
                {/* FIX: Added missing defaultValue prop to satisfy the InputField component's required props. */}
                <InputField label="Confirm New Password" id="confirmPassword" type="password" defaultValue="" placeholder="••••••••" />
            </div>
        </Card>
        
        <div className="flex justify-end space-x-3">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveChanges} loading={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
    </div>
  );
};

export default ProfileSettingsScreen;