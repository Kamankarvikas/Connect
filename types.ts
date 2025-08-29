export enum Tab {
  DASHBOARD = 'Dashboard',
  CHANNEL_ONBOARDING = 'Channel Onboarding',
  TEMPLATE_CREATION = 'Template Creation',
  CAMPAIGN = 'Campaign',
  AUDIENCE = 'Audience',
  INBOX = 'Inbox',
  CREATE_CAMPAIGN = 'Create Campaign',
  CAMPAIGN_DETAIL = 'Campaign Detail',
  CAMPAIGN_REPORT = 'Campaign Report',
  WALLET = 'Wallet',
  COMPANY_PROFILE = 'Company Profile',
  OTHER = 'Other',
}

export interface Campaign {
  id: number;
  name: string;
  status: 'Draft' | 'Scheduled' | 'Running' | 'Completed' | 'Paused';
  channel: 'WhatsApp' | 'SMS' | 'AgroBEET Network';
  reach: number;
  clicks: number;
  startDate: string;
  // Fields for editing/duplication
  accountId?: string;
  phoneNumberId?: string; // WhatsApp specific
  templateId?: number;
  audienceId?: string;
  scheduleDate?: string; // For 'Scheduled' status
}

export interface CampaignRecipientLog {
    id: string;
    campaignId: number;
    farmerName: string;
    phoneNumber: string;
    status: 'Sent' | 'Delivered' | 'Clicked' | 'Failed';
    timestamp: string;
}

export interface Audience {
  // FIX: Changed id from number to string to align with usage in campaigns (e.g., 'high-value').
  id: string;
  name: string;
  description: string;
  userCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export type CallToActionButton = { type: 'URL' | 'PHONE_NUMBER'; text: string; value: string; }
export type QuickReplyButton = { text: string };

export interface Template {
    id: number;
    name: string;
    category: 'Promotional' | 'Transactional' | 'Welcome';
    channel: 'WhatsApp' | 'SMS' | 'AgroBEET Network';
    body: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    
    // WhatsApp specific rich content
    headerType?: 'None' | 'Text' | 'Image' | 'Video' | 'Document';
    headerText?: string;
    footer?: string;
    buttonType?: 'NONE' | 'QUICK_REPLY' | 'CALL_TO_ACTION';
    quickReplyButtons?: QuickReplyButton[];
    callToActionButtons?: CallToActionButton[];

    // Other channel specific
    senderId?: string; // For SMS
    dltId?: string; // For SMS
    templateType?: string; // For App
    placementType?: string; // For App
    language?: string; // For App
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    type: 'Top-up' | 'Campaign Spend';
    method?: 'Razorpay' | 'Stripe' | 'Internal';
}

export interface ConnectedAccount {
    id: string;
    name: string;
    identifier: string;
    status: 'Active' | 'Pending' | 'Disconnected';
}

export interface Message {
  id: string;
  conversationId: number;
  sender: 'Admin' | 'Farmer';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: number;
  farmerName: string;
  farmerAvatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  associatedCampaignId?: number;
}
