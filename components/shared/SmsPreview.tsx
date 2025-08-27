import React from 'react';

interface SmsPreviewProps {
  senderId?: string;
  body: string;
}

const SmsPreview: React.FC<SmsPreviewProps> = ({ senderId = 'AGROBEET', body }) => {
  return (
    <div className="w-full max-w-[300px] h-[550px] bg-white rounded-[30px] border-[10px] border-black shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-stone-100 flex-shrink-0">
        <div className="w-full h-12 bg-stone-200 flex items-center justify-between px-3">
            <div className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="ml-2">
                    <p className="text-stone-800 font-semibold text-sm">{senderId}</p>
                </div>
            </div>
             <div className="flex items-center space-x-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-3 overflow-y-auto flex flex-col justify-end bg-stone-100">
        <p className="text-center text-xs text-stone-400 mb-2">Today, 10:32 AM</p>
        <div className="flex justify-start">
          <div className="bg-white rounded-lg shadow-sm w-auto max-w-[85%]">
            <div className="p-3">
                <div className="text-[15px] text-stone-800 whitespace-pre-wrap break-words">{body || "Your SMS message content will appear here."}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Input bar */}
      <div className="bg-stone-200 flex-shrink-0 p-2 flex items-center">
        <div className="flex-grow bg-white rounded-full mx-2 px-4 py-1.5 text-sm text-gray-500">Text Message</div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
      </div>
    </div>
  );
};

export default SmsPreview;
