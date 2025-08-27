import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { FacebookIcon, WhatsAppIcon, SmsIcon, AppIcon, ArrowLeftIcon, TrashIcon } from '../Icons';
import { ConnectedAccount } from '../../types';
import { MOCK_WHATSAPP_ACCOUNTS, MOCK_SMS_ACCOUNTS, MOCK_NETWORK_ACCOUNTS } from '../../constants';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { useToast } from '../../hooks/useToast';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

type ChannelType = 'whatsapp' | 'sms' | 'network';

interface ChannelInfo {
    name: string;
    description: string;
    icon: React.ReactNode;
}

const initialChannelData = {
    whatsapp: {
        name: 'WhatsApp Business',
        description: 'Connect accounts to reach customers with personalized messages.',
        icon: <WhatsAppIcon className="w-10 h-10 text-emerald-600" />,
        accounts: MOCK_WHATSAPP_ACCOUNTS,
    },
    sms: {
        name: 'SMS',
        description: 'Connect gateways to send time-sensitive alerts and promotions.',
        icon: <SmsIcon className="w-10 h-10 text-slate-600" />,
        accounts: MOCK_SMS_ACCOUNTS,
    },
    network: {
        name: 'AgroBEET Network',
        description: 'Deliver rich in-app messages to your network.',
        icon: <AppIcon className="w-10 h-10 text-blue-600" />,
        accounts: MOCK_NETWORK_ACCOUNTS,
    },
};


const ChannelOnboardingScreen: React.FC = () => {
    const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
    const [channelData, setChannelData] = useState(initialChannelData);
    const [accountToDelete, setAccountToDelete] = useState<ConnectedAccount | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        // This function will be called by the FB SDK script once it's loaded and initialized
        window.fbAsyncInit = function() {
          if (window.FB) {
            window.FB.init({
              // NOTE: This is a placeholder App ID.
              appId      : '123456789012345',
              cookie     : true,
              xfbml      : true,
              version    : 'v19.0'
            });
          }
        };
    
        // Check if the SDK script is already on the page
        if (!document.getElementById('facebook-jssdk')) {
            // Dynamically load the SDK script
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                if(fjs && fjs.parentNode) {
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, 'script', 'facebook-jssdk'));
        }
    }, []);

    const handleFacebookConnect = () => {
        setIsConnecting(true);
        
        // In a real-world scenario, we would call `window.FB.login()` here
        // which opens the Facebook popup. For this simulation, we'll
        // just mimic the delay and successful outcome of the embedded signup.
        setTimeout(() => {
            // FIX: The new account object was missing the `phoneNumbers` property, which is required
            // for WhatsApp accounts according to the state's type definition. Added a mock phone number array.
            const newPhoneNumberDisplay = `+91 98765 ${Math.floor(10000 + Math.random() * 90000)}`;
            const newAccount: typeof channelData.whatsapp.accounts[0] = {
                id: `wa_${new Date().getTime()}`,
                name: 'Business Number',
                identifier: `waba-id-${Date.now().toString().slice(-4)}`,
                status: 'Active',
                phoneNumbers: [
                    { id: `pn_${new Date().getTime()}`, displayName: `${newPhoneNumberDisplay} (New)` },
                ]
            };
    
            setChannelData(prevData => ({
                ...prevData,
                whatsapp: {
                    ...prevData.whatsapp,
                    accounts: [...prevData.whatsapp.accounts, newAccount],
                },
            }));
    
            addToast('New WhatsApp account connected successfully!', 'success');
            setIsConnecting(false);
        }, 2500); // Simulate API call and user interaction time
    };

    const handleDeleteClick = (account: ConnectedAccount) => {
        setAccountToDelete(account);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (accountToDelete && selectedChannel) {
            setChannelData(prevData => {
                const newAccounts = prevData[selectedChannel].accounts.filter(acc => acc.id !== accountToDelete.id);
                return {
                    ...prevData,
                    [selectedChannel]: {
                        ...prevData[selectedChannel],
                        accounts: newAccounts
                    }
                };
            });
            addToast(`Account "${accountToDelete.name}" deleted.`, 'success');
        }
        setIsConfirmOpen(false);
        setAccountToDelete(null);
    };

    const renderHub = () => (
        <>
            <div>
                <h2 className="text-3xl font-bold text-stone-800">Channel Onboarding</h2>
                <p className="text-stone-500 mt-1">Connect and manage your accounts to start sending campaigns.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(channelData) as ChannelType[]).map(key => {
                    const channel = channelData[key];
                    return (
                        <Card key={key} className="flex flex-col">
                            <div className="flex items-center mb-4">
                                {channel.icon}
                                <h3 className="text-xl font-bold ml-4">{channel.name}</h3>
                            </div>
                            <p className="text-sm text-stone-600 flex-grow">{channel.description}</p>
                            <p className="text-sm font-medium text-stone-500 my-4">
                                {channel.accounts.length} account{channel.accounts.length !== 1 && 's'} connected
                            </p>
                            <Button variant="outline" onClick={() => setSelectedChannel(key)}>
                                Manage
                            </Button>
                        </Card>
                    );
                })}
            </div>
        </>
    );

    const renderDetail = (channelType: ChannelType) => {
        const channel = channelData[channelType];
        const statusColors: Record<ConnectedAccount['status'], string> = {
            Active: 'bg-emerald-100 text-emerald-800',
            Pending: 'bg-amber-100 text-amber-800',
            Disconnected: 'bg-red-100 text-red-800',
        };

        return (
            <div>
                <Button variant="outline" className="mb-6" onClick={() => setSelectedChannel(null)}>
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to All Channels
                </Button>
                
                <div className="flex items-center mb-8">
                     {channel.icon}
                     <h2 className="text-3xl font-bold text-stone-800 ml-4">Manage {channel.name}</h2>
                </div>

                <div className="space-y-8">
                    {/* Add New Connection Card */}
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Add New Account</h3>
                        {channelType === 'whatsapp' ? (
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50/80">
                                <p className="font-semibold text-stone-700">Connect a new WhatsApp Business number</p>
                                <p className="text-xs text-stone-500 mt-1">Use the official Facebook embedded signup to securely connect.</p>
                                <Button className="mt-4" icon={<FacebookIcon />} onClick={handleFacebookConnect} loading={isConnecting}>
                                    {isConnecting ? 'Waiting for Facebook...' : 'Login with Facebook'}
                                </Button>
                            </div>
                        ) : (
                             <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Account Name</label>
                                    <input type="text" placeholder={`e.g., My ${channel.name} Account`} className="w-full max-w-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">API Key / Identifier</label>
                                    <input type="text" placeholder="Enter credentials" className="w-full max-w-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                </div>
                                <Button>Connect Account</Button>
                            </form>
                        )}
                    </Card>

                    {/* Connected Accounts List */}
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Connected Accounts</h3>
                        {channel.accounts.length > 0 ? (
                            <div className="space-y-4">
                                {channel.accounts.map(account => (
                                    <div key={account.id} className="flex flex-wrap items-center justify-between gap-4 p-4 border border-stone-200 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-stone-800">{account.name}</p>
                                            <p className="text-sm text-stone-500">{account.identifier}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[account.status]}`}>
                                                {account.status}
                                            </span>
                                            <Button variant="outline" className="py-1 px-2 text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleDeleteClick(account)}><TrashIcon className="w-5 h-5" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-stone-500">No {channel.name} accounts connected yet.</p>
                                <p className="text-sm text-stone-400">Use the form above to add your first account.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {selectedChannel ? renderDetail(selectedChannel) : renderHub()}
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Account"
                message={`Are you sure you want to delete the account "${accountToDelete?.name}"? All associated data will be removed.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default ChannelOnboardingScreen;
