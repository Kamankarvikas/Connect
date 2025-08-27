import React from 'react';
import { ImageIcon, VideoIcon, DocumentIcon, LinkIcon, PhoneIcon } from '../Icons';

type CallToActionButton = {
    type: 'URL' | 'PHONE_NUMBER';
    text: string;
}

type QuickReplyButton = {
    text: string;
}

interface WhatsAppPreviewProps {
  headerType?: 'Text' | 'Image' | 'Video' | 'Document' | 'None';
  headerText?: string;
  headerFile?: File | null;
  body: string;
  footer?: string;
  callToActionButtons?: CallToActionButton[];
  quickReplyButtons?: QuickReplyButton[];
}

const formatWhatsAppText = (text: string) => {
    const formattedText = text
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~(.*?)~/g, '<s>$1</s>')
      .replace(/\{\{([0-9]+)\}\}/g, '<span class="bg-blue-200/50 text-blue-800 font-medium rounded px-1 py-0.5 text-xs tracking-wide">{{$1}}</span>');
    
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

const HeaderPreview: React.FC<{ type: WhatsAppPreviewProps['headerType'], text?: string, file?: File | null }> = ({ type, text, file }) => {
    const placeholderClass = "bg-stone-300 h-32 flex flex-col items-center justify-center text-stone-500";

    if (file) {
        if (file.type.startsWith('image/')) {
            return <div className={placeholderClass}><ImageIcon className="w-12 h-12" /><p className="text-xs mt-2 truncate max-w-full px-2">{file.name}</p></div>;
        }
        if (file.type.startsWith('video/')) {
            return <div className={placeholderClass}><VideoIcon className="w-12 h-12" /><p className="text-xs mt-2 truncate max-w-full px-2">{file.name}</p></div>;
        }
        return <div className={placeholderClass}><DocumentIcon className="w-12 h-12" /><p className="text-xs mt-2 truncate max-w-full px-2">{file.name}</p></div>;
    }

    if (type === 'Text' && text) {
        return <p className="font-bold text-stone-800 text-base px-3 pt-2">{text}</p>;
    }
    if (type === 'Image') {
        return <div className={placeholderClass}><ImageIcon className="w-12 h-12" /></div>;
    }
    if (type === 'Video') {
        return <div className={placeholderClass}><VideoIcon className="w-12 h-12" /></div>;
    }
    if (type === 'Document') {
        return <div className={placeholderClass}><DocumentIcon className="w-12 h-12" /></div>;
    }
    return null;
}

const CtaButtonPreview: React.FC<{ button: CallToActionButton }> = ({ button }) => {
    let icon = null;
    if (button.type === 'URL') icon = <LinkIcon className="w-5 h-5 text-blue-500" />;
    if (button.type === 'PHONE_NUMBER') icon = <PhoneIcon className="w-5 h-5 text-blue-500" />;
    
    return (
        <div className="bg-stone-50/50 border-t border-stone-200/80 text-center py-2.5 text-blue-500 font-medium text-[15px] flex items-center justify-center space-x-2 cursor-pointer hover:bg-stone-100">
            {icon}
            <span>{button.text || 'Button Text'}</span>
        </div>
    )
}

const QuickReplyButtonPreview: React.FC<{ button: QuickReplyButton }> = ({ button }) => {
    return (
        <div className="bg-white rounded-full shadow-sm text-center py-1.5 px-4 text-blue-500 font-medium text-[15px] cursor-pointer hover:bg-stone-100 border border-stone-200/80">
            <span>{button.text || 'Button Text'}</span>
        </div>
    )
}


const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ headerType, headerText, headerFile, body, footer, callToActionButtons = [], quickReplyButtons = [] }) => {
  return (
    <div className="w-full max-w-[300px] h-[550px] bg-white rounded-[30px] border-[10px] border-black shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 flex-shrink-0" style={{backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundSize: 'cover'}}>
        <div className="w-full h-12 bg-emerald-700 flex items-center justify-between px-3">
            <div className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <img src="https://picsum.photos/seed/farmer/40/40" alt="Avatar" className="w-7 h-7 rounded-full ml-2"/>
                <div className="ml-2">
                    <p className="text-white font-semibold text-xs">AgroBEET Connect Customer</p>
                </div>
            </div>
             <div className="flex items-center space-x-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-3 overflow-y-auto flex flex-col justify-end">
        <div className="flex justify-start">
          <div className="bg-white rounded-lg rounded-tl-none shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] w-full overflow-hidden">
            <HeaderPreview type={headerType} text={headerText} file={headerFile}/>
            <div className="p-3 pb-1">
                <div className="text-[15px] text-stone-800 whitespace-pre-wrap break-words">{formatWhatsAppText(body)}</div>
                {footer && <div className="text-sm text-stone-500 mt-2">{footer}</div>}
                <div className="text-right text-xs text-stone-400 mt-2">10:30 AM</div>
            </div>
             {callToActionButtons.length > 0 && (
                <div className="mt-1">
                    {callToActionButtons.map((button, index) => <CtaButtonPreview key={index} button={button} />)}
                </div>
            )}
          </div>
        </div>
         {quickReplyButtons.length > 0 && (
             <div className="mt-2.5 flex flex-col items-end w-full space-y-2">
                {quickReplyButtons.map((button, index) => <QuickReplyButtonPreview key={index} button={button} />)}
            </div>
        )}
      </div>
      
      {/* Input bar */}
      <div className="bg-gray-100 flex-shrink-0 p-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div className="flex-grow bg-white rounded-full mx-2 px-4 py-1.5 text-sm text-gray-500">Type a message</div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
      </div>
    </div>
  );
};

export default WhatsAppPreview;