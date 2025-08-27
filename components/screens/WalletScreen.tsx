import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, WalletIcon, CampaignIcon, CheckCircleIcon, XCircleIcon, RazorpayIcon, CreditCardIcon, UpiIcon, NetBankingIcon, CloseIcon, SparklesIcon } from '../Icons';
import { MOCK_TRANSACTIONS } from '../../constants';
import { Transaction } from '../../types';
import { useToast } from '../../hooks/useToast';
import Spinner from '../shared/Spinner';

// --- HELPERS & SUB-COMPONENTS ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    switch (type) {
        case 'Top-up': return <WalletIcon className="w-6 h-6 text-emerald-600" />;
        case 'Campaign Spend': return <CampaignIcon className="w-6 h-6 text-amber-600" />;
        default: return <WalletIcon className="w-6 h-6 text-stone-500" />;
    }
};

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const amountColor = transaction.amount > 0 ? 'text-emerald-600' : 'text-stone-800';

    return (
        <div className="flex items-center p-4 border-b border-stone-200 last:border-b-0 hover:bg-stone-50/80">
            <div className={`p-3 rounded-full mr-4 ${transaction.amount > 0 ? 'bg-emerald-50' : 'bg-stone-100'}`}>
                <TransactionIcon type={transaction.type} />
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-stone-800">{transaction.description}</p>
                <p className="text-xs text-stone-500 font-mono mt-1">
                    {transaction.id} {transaction.method && `• ${transaction.method}`}
                </p>
            </div>
            <div className="text-right">
                <p className={`font-bold text-lg ${amountColor}`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-stone-500">{transaction.date}</p>
            </div>
        </div>
    );
};

// --- ADD FUNDS MODAL ---

const AddFundsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('2500');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const { addToast } = useToast();

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            const success = Math.random() > 0.1; // 90% success rate
            setPaymentSuccess(success);
            if (success) {
                addToast('Funds added successfully!', 'success');
            } else {
                addToast('Payment failed. Please try again.', 'error');
            }
            setStep(3);
        }, 2000);
    };
    
    const quickAddAmounts = [1000, 2500, 5000];
    const paymentMethods = [
      { id: 'card', name: 'Card', icon: <CreditCardIcon className="w-5 h-5" /> },
      { id: 'upi', name: 'UPI', icon: <UpiIcon className="w-5 h-5" /> },
      { id: 'netbanking', name: 'Net Banking', icon: <NetBankingIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden transition-all duration-300">
                {step === 1 && (
                    <>
                        <header className="p-5 border-b border-stone-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-stone-800">Add Funds</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-200">
                                <CloseIcon className="w-5 h-5 text-stone-600" />
                            </button>
                        </header>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Enter Amount</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 text-2xl font-bold">₹</span>
                                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-8 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                                </div>
                            </div>
                            <div className="flex justify-center gap-3">
                                {quickAddAmounts.map(q_amount => (
                                    <Button key={q_amount} variant="outline" onClick={() => setAmount(String(q_amount))}>+ ₹{q_amount}</Button>
                                ))}
                            </div>
                        </div>
                        <footer className="p-4 border-t border-stone-200 bg-stone-50/80 flex justify-end items-center gap-3">
                           <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={() => setStep(2)} disabled={!amount || parseFloat(amount) <= 0}>
                                Proceed to Pay {formatCurrency(parseFloat(amount) || 0)}
                            </Button>
                        </footer>
                    </>
                )}
                {step === 2 && (
                    <>
                        <header className="p-4 flex items-center justify-between border-b border-stone-200">
                            <h2 className="text-xl font-bold text-stone-800 flex items-center">
                                <RazorpayIcon className="h-6 mr-2" /> Checkout
                            </h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-200">
                                <CloseIcon className="w-5 h-5 text-stone-600" />
                            </button>
                        </header>
                         <div className="flex">
                            <div className="w-1/3 border-r border-stone-200 bg-stone-50 p-3">
                                {paymentMethods.map(method => (
                                    <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`w-full flex items-center text-left p-3 rounded-md text-sm font-semibold transition-colors ${paymentMethod === method.id ? 'bg-emerald-100 text-emerald-800' : 'text-stone-600 hover:bg-stone-200'}`}>
                                       {method.icon} <span className="ml-3">{method.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="w-2/3 p-6 text-center flex flex-col">
                                <p className="font-semibold text-lg">Mock Payment Interface</p>
                                <p className="text-sm text-stone-500">No real payment will be processed.</p>
                                <div className="my-6 p-4 border-2 border-dashed border-stone-300 rounded-xl flex-grow flex flex-col justify-center">
                                    <p className="text-stone-600">Total Amount</p>
                                    <p className="text-4xl font-bold text-emerald-600">{formatCurrency(parseFloat(amount))}</p>
                                </div>
                                <Button className="w-full" onClick={handlePay} loading={isProcessing}>
                                    {isProcessing ? 'Processing...' : `Pay Securely`}
                                </Button>
                            </div>
                         </div>
                    </>
                )}
                 {step === 3 && (
                    <div className="p-8 flex flex-col items-center justify-center text-center animate-fade-in">
                        {paymentSuccess ? (
                            <>
                                <CheckCircleIcon className="w-20 h-20 text-emerald-500" />
                                <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
                                <p className="text-stone-600 mt-1">You've successfully added {formatCurrency(parseFloat(amount))} to your wallet.</p>
                            </>
                        ) : (
                             <>
                                <XCircleIcon className="w-20 h-20 text-red-500" />
                                <h2 className="text-2xl font-bold mt-4">Payment Failed</h2>
                                <p className="text-stone-600 mt-1">Something went wrong. Please try again.</p>
                            </>
                        )}
                        <Button className="mt-8 w-full" variant={paymentSuccess ? 'primary' : 'secondary'} onClick={onClose}>{paymentSuccess ? 'Done' : 'Try Again'}</Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- MAIN WALLET SCREEN ---

const WalletScreen: React.FC = () => {
    const [isAddingFunds, setIsAddingFunds] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'topups' | 'campaign'>('all');
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
    const [aiAnalysis, setAiAnalysis] = useState<string>('');

    const totalBalance = useMemo(() => MOCK_TRANSACTIONS.reduce((acc, tx) => acc + tx.amount, 0), []);

    useEffect(() => {
        const generateAiAnalysis = async () => {
            setIsAnalyzing(true);
            setAiAnalysis('');
            try {
                if (!process.env.API_KEY) {
                    setAiAnalysis("AI analysis is disabled. API_KEY is not configured.");
                    return;
                }
                
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const campaignTransactions = MOCK_TRANSACTIONS.filter(tx => tx.type === 'Campaign Spend').map(tx => ({
                    campaign: tx.description.replace('Campaign "', '').replace('"', ''),
                    amount: Math.abs(tx.amount),
                    date: tx.date,
                }));

                if (campaignTransactions.length === 0) {
                    setAiAnalysis("No campaign spending data available to analyze.");
                    return;
                }
                
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

                const prompt = `You are a financial analyst for a marketing platform. Analyze the following campaign spending data and provide a brief, actionable summary for the user in 2-3 bullet points. Highlight the highest spending campaign and any notable trends. The currency is Indian Rupees (₹). Keep the analysis concise and easy to understand. Here is the spending data in JSON format: ${JSON.stringify(campaignTransactions)}`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setAiAnalysis(response.text);

            } catch (error) {
                console.error("Error generating AI analysis:", error);
                setAiAnalysis("Sorry, I couldn't generate an analysis at this time. Please check the console for errors.");
            } finally {
                setIsAnalyzing(false);
            }
        };

        generateAiAnalysis();
    }, []);

    const filteredTransactions = useMemo(() => {
        if (activeTab === 'topups') {
            return MOCK_TRANSACTIONS.filter(tx => tx.type === 'Top-up');
        }
        if (activeTab === 'campaign') {
            return MOCK_TRANSACTIONS.filter(tx => tx.type === 'Campaign Spend');
        }
        return [...MOCK_TRANSACTIONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [activeTab]);
    
    const spendingData = useMemo(() => {
        const campaignSpending = MOCK_TRANSACTIONS.filter(tx => tx.type === 'Campaign Spend')
            .reduce((acc, tx) => {
                const campaignName = tx.description.replace('Campaign "', '').replace('"', '');
                if (!acc[campaignName]) {
                    acc[campaignName] = 0;
                }
                acc[campaignName] += Math.abs(tx.amount);
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(campaignSpending).map(([name, value]) => ({ name, value }));
    }, []);

    const monthlyData = useMemo(() => {
        const months: Record<string, { credits: number, debits: number }> = {};
        MOCK_TRANSACTIONS.forEach(tx => {
            const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
            if (!months[month]) {
                months[month] = { credits: 0, debits: 0 };
            }
            if (tx.amount > 0) {
                months[month].credits += tx.amount;
            } else {
                months[month].debits += Math.abs(tx.amount);
            }
        });
        return Object.entries(months).map(([name, values]) => ({ name, ...values })).reverse();
    }, []);

    const SPENDING_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <>
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-stone-800">Wallet</h2>
                <p className="text-stone-500 mt-1">Manage your credits and view transaction history.</p>
            </div>
            
            <Card className="bg-gradient-to-br from-stone-800 to-stone-900 text-white shadow-2xl p-8 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                 <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="flex flex-wrap justify-between items-start gap-4 z-10 relative">
                    <div>
                        <p className="text-stone-300 text-sm">Available Credits</p>
                        <p className="text-5xl font-bold mt-2 tracking-tight">{formatCurrency(totalBalance)}</p>
                    </div>
                    <Button variant="secondary" icon={<PlusIcon />} onClick={() => setIsAddingFunds(true)}>Add Funds</Button>
                </div>
                 <p className="text-sm text-stone-400 mt-8 relative z-10 font-mono">Account ID: acct_agrobeetconnect_12345</p>
            </Card>

            <Card>
                <h3 className="text-xl font-bold mb-6">Wallet Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-center mb-2">Campaign Spend Analysis</h4>
                        <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={spendingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                        {spendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={SPENDING_COLORS[index % SPENDING_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-center mb-2">Monthly Overview</h4>
                         <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                                    <XAxis dataKey="name" tick={{ fill: '#78716c' }} fontSize={12} />
                                    <YAxis tick={{ fill: '#78716c' }} fontSize={12} tickFormatter={(value) => `₹${value/1000}k`}/>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="credits" fill="#10b981" name="Credits" />
                                    <Bar dataKey="debits" fill="#f59e0b" name="Debits" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-200/80">
                    <h4 className="font-semibold text-stone-800 text-lg mb-4 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2 text-amber-500" />
                        AI-Powered Analysis
                    </h4>
                     {isAnalyzing ? (
                        <div className="flex items-center justify-center p-8">
                            <Spinner className="w-8 h-8 text-emerald-600" />
                            <p className="ml-4 text-stone-600">Analyzing your spending patterns...</p>
                        </div>
                    ) : (
                         <div className="text-sm text-stone-700 space-y-2">
                             {aiAnalysis.split('\n').map((line, index) => {
                                const trimmedLine = line.trim();
                                if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
                                    return <p key={index} className="flex items-start"><span className="mr-3 mt-1 text-emerald-600">✔</span><span>{trimmedLine.replace(/^[*\-]\s*/, '')}</span></p>;
                                }
                                return <p key={index}>{trimmedLine}</p>;
                             })}
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-0">
                <div className="p-6 border-b border-stone-200">
                    <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                    <div className="flex border-b border-stone-200">
                        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All</TabButton>
                        <TabButton active={activeTab === 'topups'} onClick={() => setActiveTab('topups')}>Top-ups</TabButton>
                        <TabButton active={activeTab === 'campaign'} onClick={() => setActiveTab('campaign')}>Campaign</TabButton>
                    </div>
                </div>
                <div>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)
                    ) : (
                        <p className="text-center text-stone-500 p-8">No transactions found for this filter.</p>
                    )}
                </div>
            </Card>
        </div>

        {isAddingFunds && <AddFundsModal onClose={() => setIsAddingFunds(false)} />}
    </>
  );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, children: React.ReactNode}> = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold transition-colors ${active ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-stone-500 hover:text-stone-800 border-b-2 border-transparent'}`}
    >
        {children}
    </button>
);

export default WalletScreen;