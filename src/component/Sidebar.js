/* global chrome */

import React, { useState } from 'react';
import InvoiceOverview from './functions/InvoiceOverview';
import ReminderSetup from './functions/ReminderSetup';
import Join from './Join';

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('invoiceOverview');

  const handleInvoiceSelect = (invoice) => {
    // Send a message to the content script to show the modal
    window.parent.postMessage({ type: "SHOW_INVOICE_MODAL", invoice }, '*');
  };

  const handleLogin = () => {
    // Implement your login logic here
    setIsLoggedIn(true);
  };

  const renderTool = () => {
    switch (activeTab) {
      case 'invoiceOverview':
        return <InvoiceOverview onInvoiceSelect={handleInvoiceSelect} />;
      case 'reminderSetup':
        return <ReminderSetup />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-80 bg-white shadow-lg h-screen flex flex-col">
        <Join onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="w-80 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Invoice Manager</h1>
      </div>
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mx-2">
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === 'invoiceOverview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('invoiceOverview')}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === 'reminderSetup'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('reminderSetup')}
        >
          Reminders
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderTool()}
      </div>
    </div>
  );
};

export default Sidebar;
