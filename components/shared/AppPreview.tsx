import React, { useMemo, useEffect } from 'react';
import { AppIcon } from '../Icons';

interface AppPreviewProps {
  name: string;
  body: string;
  templateType?: string;
  placementType?: string;
  imageFile?: File | null;
  videoFile?: File | null;
}

const AppPreview: React.FC<AppPreviewProps> = ({ name, body, templateType = 'In-App Message', placementType = 'Modal Popup', imageFile, videoFile }) => {
  const imageUrl = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : null, [imageFile]);
  const videoUrl = useMemo(() => videoFile ? URL.createObjectURL(videoFile) : null, [videoFile]);

  useEffect(() => {
    // Cleanup function to revoke the object URL to avoid memory leaks
    return () => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [imageUrl, videoUrl]);

  const MockAppUI = () => (
    <>
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-stone-200/50 px-2 flex justify-between items-center text-xs font-semibold text-stone-700 z-0">
        <span>10:35</span>
        <div className="flex items-center space-x-1">
          <span>📶</span>
          <span>5G</span>
          <span>🔋</span>
        </div>
      </div>
      
      {/* App Header */}
      <div className="pt-6 h-14 bg-white flex items-center px-4 border-b border-stone-200">
        <h1 className="text-lg font-bold text-stone-800">AgroBEET App</h1>
      </div>
      
      {/* App Content */}
      <div className="p-4 space-y-4">
        <div className="h-24 bg-white rounded-lg border border-stone-200 p-3">
            <p className="font-semibold">Weather Forecast</p>
            <p className="text-sm text-stone-500">Sunny, 28°C</p>
        </div>
        
        {(placementType === 'Banner Ads' || placementType === 'Home Screen') && (
            <div className="bg-emerald-100 rounded-lg border border-emerald-300 overflow-hidden text-center">
                {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover"/>}
                {videoUrl && <div className="h-32 bg-stone-800 text-white flex items-center justify-center font-semibold">Video Preview</div>}
                <p className="text-sm text-emerald-800 p-3">{body || 'Your banner content here.'}</p>
            </div>
        )}

        <div className="h-24 bg-white rounded-lg border border-stone-200 p-3">
            <p className="font-semibold">Market Prices</p>
            <p className="text-sm text-stone-500">Wheat: ₹2,250/quintal</p>
        </div>
        <div className="h-24 bg-white rounded-lg border border-stone-200 p-3">
            <p className="font-semibold">My Crops</p>
            <p className="text-sm text-stone-500">Next activity: Irrigation</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-[300px] h-[550px] bg-stone-100 rounded-[30px] border-[10px] border-black shadow-2xl overflow-hidden flex flex-col relative">
      <MockAppUI />
      
      {/* Overlays */}
      {templateType === 'Push Notification' && (
         <div className="absolute top-8 left-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-stone-200/50 flex items-start z-10">
             <div className="p-1 bg-emerald-600 rounded-md mr-2">
                <AppIcon className="w-4 h-4 text-white" />
             </div>
             <div className="flex-grow">
                <p className="font-bold text-xs text-stone-800">AgroBEET</p>
                <p className="font-semibold text-xs mt-0.5">{name}</p>
                <p className="text-xs text-stone-600">{body}</p>
             </div>
         </div>
      )}

      {templateType === 'In-App Message' && placementType === 'Modal Popup' && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8 z-10">
            <div className="bg-white rounded-xl shadow-2xl w-full text-center overflow-hidden">
                {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover"/>}
                {videoUrl && <div className="h-32 bg-stone-800 text-white flex items-center justify-center font-semibold">Video Preview</div>}
                <div className="p-4">
                    <h3 className="font-bold text-lg text-stone-800 mb-2">{name || 'Message Title'}</h3>
                    <p className="text-sm text-stone-600 mb-4">{body || 'Your message body will appear here.'}</p>
                    <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">OK</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AppPreview;
