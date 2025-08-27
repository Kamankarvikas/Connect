
import React from 'react';
import Card from '../shared/Card';

const OtherScreen: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-stone-800">Help & Support</h2>
        <p className="text-stone-500 mt-1">Find answers to your questions or log out.</p>
      </div>
      <Card>
        <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">How do I create a campaign?</h4>
            <p className="text-stone-600">Navigate to the 'Campaign' tab and click the 'Create Campaign' button to start the wizard.</p>
          </div>
          <div>
            <h4 className="font-semibold">How do I add funds to my wallet?</h4>
            <p className="text-stone-600">Go to the 'Wallet' tab and click the 'Add Funds' button. You will be redirected to a secure payment page.</p>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-xl font-bold mb-2">Logout</h3>
        <p className="text-stone-600">Are you sure you want to log out of your account?</p>
        <button className="mt-4 bg-red-600 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm hover:bg-red-700">
          Log Out
        </button>
      </Card>
    </div>
  );
};

export default OtherScreen;
