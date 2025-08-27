import React from 'react';
import { Tab, Campaign, Template, Transaction, ConnectedAccount, Audience, CampaignRecipientLog } from './types';
import { DashboardIcon, ChannelIcon, TemplateIcon, CampaignIcon, WalletIcon, SettingsIcon, OtherIcon, UsersGroupIcon } from './components/Icons';

export const TABS = Tab;

export const NAV_ITEMS = [
  { id: TABS.DASHBOARD, label: TABS.DASHBOARD, icon: <DashboardIcon /> },
  { id: TABS.CHANNEL_ONBOARDING, label: TABS.CHANNEL_ONBOARDING, icon: <ChannelIcon /> },
  { id: TABS.TEMPLATE_CREATION, label: TABS.TEMPLATE_CREATION, icon: <TemplateIcon /> },
  { id: TABS.CAMPAIGN, label: TABS.CAMPAIGN, icon: <CampaignIcon /> },
  { id: TABS.AUDIENCE, label: TABS.AUDIENCE, icon: <UsersGroupIcon /> },
  { id: TABS.WALLET, label: TABS.WALLET, icon: <WalletIcon /> },
  { id: TABS.OTHER, label: TABS.OTHER, icon: <OtherIcon /> },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
    { id: 1, name: 'Spring Planting Sale', status: 'Running', channel: 'WhatsApp', reach: 12500, clicks: 875, startDate: '2024-06-10', templateId: 2, audienceId: 'high-value', accountId: 'wa_1', phoneNumberId: 'pn_1' },
    { id: 2, name: 'Harvest Festival Early Bird', status: 'Scheduled', channel: 'WhatsApp', reach: 0, clicks: 0, startDate: '2024-07-01', scheduleDate: '2024-07-01T10:00', templateId: 12, audienceId: 'all', accountId: 'wa_1', phoneNumberId: 'pn_2' },
    { id: 3, name: 'New Equipment Demo', status: 'Completed', channel: 'SMS', reach: 5000, clicks: 450, startDate: '2024-05-15', templateId: 5, audienceId: 'new', accountId: 'sms_1' },
    { id: 4, name: 'Summer Crop Update', status: 'Draft', channel: 'AgroBEET Network', reach: 0, clicks: 0, startDate: '2024-06-25', templateId: 8, audienceId: 'all', accountId: 'app_1' },
    { id: 5, name: 'Fertilizer Discount', status: 'Completed', channel: 'WhatsApp', reach: 8000, clicks: 1200, startDate: '2024-04-20', templateId: 1, audienceId: 'high-value', accountId: 'wa_1', phoneNumberId: 'pn_1' },
    { id: 6, name: 'Monsoon Advisory', status: 'Paused', channel: 'WhatsApp', reach: 1500, clicks: 50, startDate: '2024-06-18', scheduleDate: '2024-06-28T12:00', templateId: 12, audienceId: 'inactive', accountId: 'wa_1', phoneNumberId: 'pn_1' },
];

// FIX: Changed audience IDs to strings (slugs) to match their usage in MOCK_CAMPAIGNS and the rest of the app. Added the 'all' audience for data consistency.
export const MOCK_AUDIENCES: Audience[] = [
    { id: 'high-value', name: 'High-Value Farmers (Punjab)', description: 'Farmers from Punjab who purchased high-value seeds in the last 6 months.', userCount: 1250, status: 'Active', createdAt: '2024-06-01' },
    { id: 'new', name: 'New Subscribers (Last 30 Days)', description: 'All new users who signed up on the AgroBEET Network app in the last 30 days.', userCount: 450, status: 'Active', createdAt: '2024-05-20' },
    { id: 'inactive', name: 'Inactive Users', description: 'Users who have not made a purchase or logged in for over 90 days.', userCount: 2300, status: 'Inactive', createdAt: '2024-04-15' },
    { id: 'up-wheat', name: 'Wheat Farmers (UP)', description: 'Farmers in Uttar Pradesh who have shown interest in wheat crops.', userCount: 5600, status: 'Active', createdAt: '2024-03-10' },
    { id: 'all', name: 'All Subscribers', description: 'All subscribers across all platforms.', userCount: 12500, status: 'Active', createdAt: '2024-01-01' },
];

const generateCampaignLogs = (campaign: Campaign): CampaignRecipientLog[] => {
    if (campaign.status === 'Draft' || campaign.status === 'Scheduled') return [];

    const logs: CampaignRecipientLog[] = [];
    const baseDate = new Date(campaign.startDate);

    for (let i = 0; i < campaign.reach; i++) {
        const randomStatus = Math.random();
        let status: CampaignRecipientLog['status'];
        let clicks = 0;
        
        if (randomStatus < 0.85) { // 85% Delivered
            status = 'Delivered';
        } else if (randomStatus < 0.98) { // 13% Failed
            status = 'Failed';
        } else { // 2% Sent (but not delivered yet)
            status = 'Sent';
        }

        // Clicks are a percentage of delivered messages
        if (status === 'Delivered' && i < campaign.clicks) {
            status = 'Clicked';
        }
        
        logs.push({
            id: `log_${campaign.id}_${i}`,
            campaignId: campaign.id,
            farmerName: `Farmer #${String(1000 + i).padStart(4, '0')}`,
            phoneNumber: `+9198765${String(10000 + i).padStart(5, '0')}`,
            status: status,
            timestamp: new Date(baseDate.getTime() + i * 1000).toISOString(),
        });
    }
    return logs;
}

export const MOCK_CAMPAIGN_LOGS: CampaignRecipientLog[] = MOCK_CAMPAIGNS.flatMap(generateCampaignLogs);

export const MOCK_TEMPLATES: Template[] = [
    // WhatsApp
    { 
        id: 1, 
        name: 'Welcome New Customer', 
        category: 'Welcome', 
        channel: 'WhatsApp', 
        body: 'Hi {{name}}! Welcome to the AgroBEET Connect family. We\'re thrilled to help you grow.', 
        status: 'Approved',
        headerType: 'Text',
        headerText: 'Welcome!',
        footer: 'Your friends at AgroBEET Connect',
        buttonType: 'QUICK_REPLY',
        quickReplyButtons: [{ text: 'Browse Products' }, { text: 'Contact Support' }],
    },
    { 
        id: 2, 
        name: 'New Product Announcement', 
        category: 'Promotional', 
        channel: 'WhatsApp', 
        body: 'Introducing the new high-yield corn seed. Tap to learn more and get a special introductory price.', 
        status: 'Approved',
        headerType: 'Image',
        footer: 'Limited Time Offer',
        buttonType: 'CALL_TO_ACTION',
        callToActionButtons: [{ type: 'URL', text: 'Learn More', value: 'https://agrobeet.com/products/corn' }]
    },
    { 
        id: 3, 
        name: 'Shipping Update', 
        category: 'Transactional', 
        channel: 'WhatsApp', 
        body: 'Your order #{{order_id}} has been shipped!', 
        status: 'Pending',
        buttonType: 'CALL_TO_ACTION',
        callToActionButtons: [{ type: 'URL', text: 'Track Your Order', value: 'https://agrobeet.com/orders/{{order_id}}' }]
    },
    { 
        id: 4, 
        name: 'Weekly Farming Tips', 
        category: 'Promotional', 
        channel: 'WhatsApp', 
        body: 'Catch up on this week\'s farming news and tips for better soil health.', 
        status: 'Rejected' 
    },
    { 
        id: 10, 
        name: 'Order Confirmation', 
        category: 'Transactional', 
        channel: 'WhatsApp', 
        body: 'Thanks for your order, {{name}}! Your order #{{order_id}} for {{item}} has been confirmed. We will notify you once it ships.', 
        status: 'Approved',
        footer: 'Thank you for your business!'
    },
    { 
        id: 11, 
        name: 'Abandoned Cart Reminder', 
        category: 'Promotional', 
        channel: 'WhatsApp', 
        body: 'Still thinking about it? The items in your cart are waiting for you. Complete your purchase now!', 
        status: 'Pending',
        buttonType: 'QUICK_REPLY',
        quickReplyButtons: [{ text: 'Complete Purchase' }]
    },
    { 
        id: 12, 
        name: 'Monsoon Season Advisory', 
        category: 'Promotional', 
        channel: 'WhatsApp', 
        body: 'The monsoon is here! Get ready with our specialized fertilizers and waterproof equipment. 20% off for a limited time.', 
        status: 'Approved',
        headerType: 'Text',
        headerText: '🌧️ Monsoon Alert!',
        buttonType: 'CALL_TO_ACTION',
        callToActionButtons: [{ type: 'URL', text: 'Shop Now', value: 'https://agrobeet.com/monsoon'}]
    },
    { 
        id: 13, 
        name: 'Feedback Request', 
        category: 'Transactional', 
        channel: 'WhatsApp', 
        body: 'We value your opinion! How was your recent purchase of {{item}}? Please take a moment to give us your feedback.', 
        status: 'Approved' 
    },

    // SMS
    { id: 5, name: 'Flash Sale Alert', category: 'Promotional', channel: 'SMS', body: '🌾 AgroBEET Connect Sale! Get 25% off all seeds for the next 48 hours. Shop now!', status: 'Approved', senderId: 'AGROBT', dltId: '123456789012345' },
    { id: 6, name: 'OTP Verification', category: 'Transactional', channel: 'SMS', body: 'Your OTP is {{otp}}. Do not share it with anyone.', status: 'Approved', senderId: 'AGROBT', dltId: '123456789012346' },
    { id: 7, name: 'Upcoming Event Reminder', category: 'Promotional', channel: 'SMS', body: 'Reminder: The annual farmer\'s meet is tomorrow at 10 AM.', status: 'Pending', senderId: 'AGROBT', dltId: '123456789012347' },
    { id: 14, name: 'Payment Reminder', category: 'Transactional', channel: 'SMS', body: 'Dear customer, your payment of INR {{amount}} is due on {{date}}. Please pay to avoid late fees. AgroBEET Connect.', status: 'Approved', senderId: 'AGRO-TX', dltId: '987654321098765' },
    { id: 15, name: 'Harvest Season Offer', category: 'Promotional', channel: 'SMS', body: 'Harvest season is here! Get up to 40% off on harvesting equipment. Limited stock. Visit our website now!', status: 'Rejected', senderId: 'AGROBT', dltId: '123456789012348' },


    // App
    { id: 8, name: 'In-App Welcome Offer', channel: 'AgroBEET Network', body: 'Welcome! Here is a special 15% discount on your first in-app purchase. Use code: APP15', status: 'Approved', templateType: 'Home Screen', placementType: 'Banner Ads', language: 'English', category: 'Promotional' },
    { id: 9, name: 'App Update Notification', channel: 'AgroBEET Network', body: 'A new version of the app is available. Update now for the latest features and improved performance.', status: 'Rejected', templateType: 'Push Notification', placementType: 'System Tray', language: 'English', category: 'Transactional' },
    { id: 16, name: 'New Feature Tour', channel: 'AgroBEET Network', body: 'Check out our new soil analysis feature! Get instant reports right from your phone.', status: 'Approved', templateType: 'In-App Message', placementType: 'Modal Popup', language: 'English', category: 'Welcome' },
    { id: 17, name: 'Localized Weather Alert', channel: 'AgroBEET Network', body: 'Heads up! Heavy rainfall expected in your area for the next 48 hours. Take necessary precautions for your crops.', status: 'Pending', templateType: 'Push Notification', placementType: 'System Tray', language: 'All', category: 'Transactional' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'txn_raz_1a2b3c', date: '2024-06-15', description: 'Added funds to wallet', amount: 5000.00, status: 'Completed', type: 'Top-up', method: 'Razorpay' },
    { id: 'txn_cmp_4d5e6f', date: '2024-06-10', description: 'Campaign "Spring Planting Sale"', amount: -750.50, status: 'Completed', type: 'Campaign Spend' },
    { id: 'txn_raz_7g8h9i', date: '2024-05-20', description: 'Added funds to wallet', amount: 2500.00, status: 'Completed', type: 'Top-up', method: 'Razorpay' },
    { id: 'txn_cmp_j1k2l3', date: '2024-05-15', description: 'Campaign "New Equipment Demo"', amount: -300.00, status: 'Completed', type: 'Campaign Spend' },
    { id: 'txn_raz_p7q8r9', date: '2024-06-01', description: 'Added funds to wallet', amount: 10000.00, status: 'Completed', type: 'Top-up', method: 'Razorpay' },
    { id: 'txn_cmp_s1t2u3', date: '2024-06-12', description: 'Campaign "Spring Planting Sale"', amount: -1200.00, status: 'Completed', type: 'Campaign Spend' },
];


export const MOCK_WHATSAPP_ACCOUNTS: (ConnectedAccount & { phoneNumbers: { id: string; displayName: string; }[] })[] = [
    { 
        id: 'wa_1', 
        name: 'Appleseed Farms WABA', 
        identifier: 'waba-id-1234', 
        status: 'Active',
        phoneNumbers: [
            { id: 'pn_1', displayName: '+91 98765 43210 (Marketing)' },
            { id: 'pn_2', displayName: '+91 98765 43211 (Support)' },
        ]
    },
    { 
        id: 'wa_2', 
        name: 'Secondary WABA', 
        identifier: 'waba-id-5678', 
        status: 'Pending',
        phoneNumbers: [
            { id: 'pn_3', displayName: '+1 555-123-4568 (Promotions)' }
        ]
    },
];


export const MOCK_SMS_ACCOUNTS: ConnectedAccount[] = [
    { id: 'sms_1', name: 'Twilio Gateway', identifier: 'ACme12345...', status: 'Active' },
];

export const MOCK_NETWORK_ACCOUNTS: ConnectedAccount[] = [
    { id: 'app_1', name: 'AgroBEET Network', identifier: 'com.agrobeet.app', status: 'Active' },
];

export const MOCK_COMPANY_PROFILE = {
    info: {
        name: 'Appleseed Farms Inc.',
        email: 'contact@appleseedfarms.com',
        phone: '+91 98765 43210',
        url: 'https://appleseedfarms.com',
    },
    address: {
        country: 'India',
        state: 'Punjab',
        district: 'Amritsar',
        subDistrict: 'Ajnala',
        village: 'Ramdass',
        fullAddress: '123, Orchard Lane, Near Golden Temple',
    },
    documents: {
        gstin: { number: '22AAAAA0000A1Z5', file: { name: 'gstin_certificate.pdf', url: '#' } },
        cin: { number: 'U01100PB2023PTC012345', file: { name: 'cin_document.pdf', url: '#' } },
        pan: { number: 'ABCDE1234F', file: { name: 'pan_card.jpg', url: '#' } },
    }
};