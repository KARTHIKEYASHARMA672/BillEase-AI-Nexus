import React, { createContext, useContext, useState, useEffect } from 'react';

const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // AI Nexus State - Persistent across tab switches
  const [sessions, setSessions] = useState([
    { id: '1', title: 'Financial Planning', messages: [
      { role: 'assistant', content: "Hello! I'm your Nexus AI. I have access to your bill data. Ask me anything about your spending, upcoming dues, or total monthly costs!" }
    ]}
  ]);
  const [activeSessionId, setActiveSessionId] = useState('1');

  const [bills, setBills] = useState([
    { id: 1, title: 'Electricity Bill', amount: 85.50, dueDate: '2026-05-15', category: 'Electricity', status: 'unpaid', recurring: true },
    { id: 2, title: 'Fiber Internet', amount: 60.00, dueDate: '2026-05-10', category: 'Internet', status: 'unpaid', recurring: true },
    { id: 3, title: 'Monthly Rent', amount: 1200.00, dueDate: '2026-05-01', category: 'Rent', status: 'paid', recurring: true },
    { id: 4, title: 'Netflix Subscription', amount: 15.99, dueDate: '2026-05-12', category: 'Subscriptions', status: 'unpaid', recurring: true },
    { id: 5, title: 'Car Insurance', amount: 110.00, dueDate: '2026-05-20', category: 'Insurance', status: 'unpaid', recurring: false },
  ]);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I am Nexus, your AI financial assistant. How can I help you manage your BillEase account today?', timestamp: new Date() }
  ]);

  const addBill = (bill) => {
    setBills([...bills, { ...bill, id: Date.now(), status: 'unpaid' }]);
  };

  const markAsPaid = (id) => {
    setBills(bills.map(bill => bill.id === id ? { ...bill, status: 'paid' } : bill));
  };

  const deleteBill = (id) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  const addChatMessage = (message) => {
    setChatHistory(prev => [...prev, { ...message, id: Date.now(), timestamp: new Date() }]);
  };

  return (
    <BillContext.Provider value={{ 
      bills, 
      addBill, 
      markAsPaid, 
      deleteBill, 
      chatHistory, 
      addChatMessage,
      searchQuery,
      setSearchQuery,
      showSettingsModal,
      setShowSettingsModal,
      showHelpModal,
      setShowHelpModal,
      showCalendarModal,
      setShowCalendarModal,
      showNotificationsModal,
      setShowNotificationsModal,
      sessions,
      setSessions,
      activeSessionId,
      setActiveSessionId
    }}>
      {children}
    </BillContext.Provider>
  );
};

export const useBills = () => useContext(BillContext);
