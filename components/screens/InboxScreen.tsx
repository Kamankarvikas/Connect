import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Conversation, Message } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { SearchIcon, SendIcon, CampaignIcon, InboxIcon } from '../Icons';

interface InboxScreenProps {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    messages: Message[];
    onSendMessage: (conversationId: number, text: string) => void;
}

const simpleTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
};

const ConversationListItem: React.FC<{
    convo: Conversation;
    isSelected: boolean;
    onClick: () => void;
}> = ({ convo, isSelected, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-3 flex items-start space-x-3 transition-colors ${isSelected ? 'bg-emerald-50' : 'hover:bg-stone-50'}`}
    >
        <img src={convo.farmerAvatar} alt={convo.farmerName} className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-grow min-w-0">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-stone-800 truncate">{convo.farmerName}</p>
                <p className="text-xs text-stone-500 flex-shrink-0 ml-2">
                    {simpleTimeAgo(convo.lastMessageTimestamp)}
                </p>
            </div>
            <p className={`text-sm mt-1 truncate ${convo.unreadCount > 0 ? 'text-stone-800 font-bold' : 'text-stone-500'}`}>{convo.lastMessage}</p>
        </div>
        {convo.unreadCount > 0 && (
            <div className="bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center self-center ml-2 flex-shrink-0">
                {convo.unreadCount}
            </div>
        )}
    </button>
);

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isAdmin = message.sender === 'Admin';
    return (
        <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl ${isAdmin ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-stone-800 rounded-bl-none border border-stone-200'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isAdmin ? 'text-emerald-200' : 'text-stone-400'} text-right`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

const InboxScreen: React.FC<InboxScreenProps> = ({ conversations, setConversations, messages, onSendMessage }) => {
    const [selectedConvoId, setSelectedConvoId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const filteredConversations = useMemo(() => {
        return conversations
            .filter(c => c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
    }, [conversations, searchTerm]);

    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConvoId);
    }, [selectedConvoId, conversations]);

    const messagesForSelectedConvo = useMemo(() => {
        if (!selectedConvoId) return [];
        return messages.filter(m => m.conversationId === selectedConvoId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [selectedConvoId, messages]);

    useEffect(() => {
        // Automatically select the first conversation if none is selected and list is not empty
        if (!selectedConvoId && filteredConversations.length > 0) {
            handleSelectConversation(filteredConversations[0].id);
        }
        // If the selected convo is filtered out, clear the selection
        if (selectedConvoId && !filteredConversations.some(c => c.id === selectedConvoId)) {
            setSelectedConvoId(null);
        }
    }, [filteredConversations, selectedConvoId]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesForSelectedConvo]);

    const handleSelectConversation = (id: number) => {
        setSelectedConvoId(id);
        // Mark conversation as read
        setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConvoId) {
            onSendMessage(selectedConvoId, newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-stone-800">Inbox</h2>
                <p className="text-stone-500 mt-1">Manage conversations with your farmers.</p>
            </div>
            <Card className="p-0 h-[75vh] flex overflow-hidden">
                {/* Conversation List */}
                <div className="w-full md:w-2/5 lg:w-1/3 border-r border-stone-200 flex flex-col">
                    <div className="p-3 border-b border-stone-200">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-stone-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-stone-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto divide-y divide-stone-200">
                        {filteredConversations.map(convo => (
                            <ConversationListItem 
                                key={convo.id} 
                                convo={convo} 
                                isSelected={selectedConvoId === convo.id} 
                                onClick={() => handleSelectConversation(convo.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <header className="p-3 border-b border-stone-200 flex items-center space-x-3 bg-white">
                                <img src={selectedConversation.farmerAvatar} alt={selectedConversation.farmerName} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-stone-800">{selectedConversation.farmerName}</p>
                                    {selectedConversation.associatedCampaignId && (
                                        <div className="text-xs text-stone-500 flex items-center">
                                            <CampaignIcon className="w-3 h-3 mr-1" />
                                            Replied to Campaign #{selectedConversation.associatedCampaignId}
                                        </div>
                                    )}
                                </div>
                            </header>

                            <main className="flex-grow p-4 overflow-y-auto bg-stone-50 space-y-4">
                                {messagesForSelectedConvo.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                                <div ref={messagesEndRef} />
                            </main>

                            <footer className="p-3 bg-white border-t border-stone-200">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        className="w-full px-4 py-2 bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <Button type="submit" className="rounded-full !p-3" disabled={!newMessage.trim()}>
                                        <SendIcon className="w-5 h-5"/>
                                    </Button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center text-stone-500 bg-stone-50">
                            <InboxIcon className="w-16 h-16 text-stone-300 mb-4"/>
                            <h3 className="text-lg font-semibold">Select a conversation</h3>
                            <p className="max-w-xs">Choose a conversation from the list on the left to view messages and reply.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default InboxScreen;