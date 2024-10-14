import React, { useState, useEffect } from 'react';

const ReminderSetup = () => {
  const [invoices, setInvoices] = useState([]);
  const [reminderDays, setReminderDays] = useState({});

  useEffect(() => {
    // Mock data for invoices
    const mockInvoices = [
      { id: 1, amount: 1000, status: 'sent', dueDate: '2023-05-15' },
      { id: 2, amount: 1500, status: 'unpaid', dueDate: '2023-05-10' },
      { id: 3, amount: 2000, status: 'overdue', dueDate: '2023-05-01' },
      { id: 4, amount: 1200, status: 'paid', dueDate: '2023-05-05' },
      { id: 5, amount: 800, status: 'sent', dueDate: '2023-05-20' },
      { id: 6, amount: 1800, status: 'unpaid', dueDate: '2023-05-12' },
      { id: 7, amount: 2200, status: 'paid', dueDate: '2023-05-03' },
    ];

    // Filter unpaid and overdue invoices
    const unpaidAndOverdue = mockInvoices.filter(invoice => 
      invoice.status === 'unpaid' || invoice.status === 'overdue'
    );
    setInvoices(unpaidAndOverdue);
  }, []);

  const setReminder = (invoice) => {
    const days = reminderDays[invoice.id];
    if (!days) return;

    const reminderDate = new Date(invoice.dueDate);
    reminderDate.setDate(reminderDate.getDate() - days);
    
    const eventDetails = encodeURIComponent(`Reminder: Invoice ${invoice.id} due in ${days} days`);
    
    // Format the date for Google Calendar URL
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "").slice(0, -1);
    };
    
    const startDate = formatDate(reminderDate);
    const endDate = formatDate(new Date(reminderDate.getTime() + 24 * 60 * 60 * 1000)); // Add one day for end date
    
    const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${eventDetails}&dates=${startDate}/${endDate}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleReminderChange = (invoiceId, days) => {
    setReminderDays(prev => ({ ...prev, [invoiceId]: days }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Unpaid and Overdue Invoices</h2>
      <div className="space-y-4">
        {invoices.map(invoice => (
          <div key={invoice.id} className={`p-4 rounded-lg shadow ${invoice.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Invoice #{invoice.id}</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">₹{invoice.amount.toLocaleString()}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  invoice.status === 'overdue' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-gray-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-600 block mb-4">Due: {invoice.dueDate}</span>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, Math.floor((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                  value={reminderDays[invoice.id] || ''}
                  onChange={(e) => handleReminderChange(invoice.id, parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  days
                </span>
              </div>
              <button 
                onClick={() => setReminder(invoice)} 
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-300 flex-shrink-0"
                disabled={!reminderDays[invoice.id]}
              >
                Set Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderSetup;
