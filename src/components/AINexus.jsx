import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, Trash2, History, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useBills } from '../context/BillContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const AINexus = () => {
  const { bills, sessions, setSessions, activeSessionId, setActiveSessionId } = useBills();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages, isTyping]);

  const generateGeminiResponse = async (userPrompt) => {
    try {
      // Upgraded to Gemini 2.5 Flash as requested
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "You are Nexus, a brilliant financial assistant for BillEase. You have direct access to the user's bills. Be concise, friendly, and data-driven. If asked about totals, calculate them exactly from the provided data. Format currency with $. Use bullet points for lists."
      });
      
      const unpaidBills = bills.filter(b => b.status === 'unpaid');
      const paidBills = bills.filter(b => b.status === 'paid');
      const totalUnpaid = unpaidBills.reduce((a, b) => a + b.amount, 0);
      const totalPaid = paidBills.reduce((a, b) => a + b.amount, 0);
      const totalMonthly = bills.reduce((a, b) => a + b.amount, 0);

      const dataSummary = `
        Contextual Data:
        - Total Monthly Bills: $${totalMonthly.toFixed(2)}
        - Total Paid: $${totalPaid.toFixed(2)} (${paidBills.length} bills)
        - Total Unpaid: $${totalUnpaid.toFixed(2)} (${unpaidBills.length} bills)
        - Specific Bills: ${bills.map(b => `${b.title} ($${b.amount}, Due: ${b.dueDate}, Status: ${b.status})`).join(', ')}
      `;

      const result = await model.generateContent(`${dataSummary}\n\nUser Question: ${userPrompt}`);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.error("Gemini Error:", err);
      return "I'm having a slight connection issue with my neural network. Please verify that your API key is active and has 'Gemini API' enabled in the Google AI Studio.";
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setError(null);
    const userMessage = { role: 'user', content: input };
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMessage] } : s));
    
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const aiResponseContent = await generateGeminiResponse(currentInput);
    
    const aiMessage = { role: 'assistant', content: aiResponseContent };
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMessage] } : s));
    setIsTyping(false);
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: `Analysis ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
      messages: [{ role: 'assistant', content: "New analysis session started. How can I help you with your finances today?" }]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    if (sessions.length === 1) return;
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id) setActiveSessionId(updated[0].id);
  };

  return (
    <div className="nexus-container animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 160px)', gap: '24px' }}>
      {/* Sidebar - Sessions List */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button 
          onClick={createNewSession}
          className="btn-primary"
          style={{ 
            width: '100%', 
            padding: '14px', 
            borderRadius: '14px', 
            border: 'none', 
            fontWeight: '700', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            cursor: 'pointer',
            background: 'var(--primary)',
            color: 'white',
            boxShadow: 'var(--shadow-neon)'
          }}
        >
          <Plus size={18} /> New Conversation
        </button>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: '800', letterSpacing: '1px', padding: '0 10px' }}>Recent Conversations</p>
          {sessions.map(s => (
            <div 
              key={s.id} 
              onClick={() => setActiveSessionId(s.id)}
              className="chat-session-item"
              style={{ 
                padding: '14px', 
                borderRadius: '14px', 
                cursor: 'pointer',
                background: s.id === activeSessionId ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                color: s.id === activeSessionId ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                border: s.id === activeSessionId ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid transparent'
              }}
            >
              <History size={16} />
              <span style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{s.title}</span>
              <button 
                onClick={(e) => deleteSession(e, s.id)}
                className="delete-btn"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', opacity: 0 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        <header style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '14px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              boxShadow: 'var(--shadow-neon)'
            }}>
              <Bot size={26} />
            </div>
            <div>
              <h3 style={{ fontWeight: '800', fontSize: '18px' }}>Nexus Financial AI</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                <div className="pulse-dot"></div>
                Live Analysis Mode
              </div>
            </div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <RefreshCw size={18} />
          </button>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeSession.messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '16px' }}>
              {m.role === 'assistant' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-deep)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  <Bot size={20} />
                </div>
              )}
              <div style={{ 
                maxWidth: '75%', 
                padding: '16px 20px', 
                borderRadius: '20px', 
                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                color: 'white',
                fontSize: '15px',
                lineHeight: '1.6',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                boxShadow: m.role === 'user' ? '0 8px 24px rgba(168, 85, 247, 0.2)' : 'none',
                borderBottomRightRadius: m.role === 'user' ? '4px' : '20px',
                borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '20px'
              }}>
                {m.content}
              </div>
              {m.role === 'user' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', flexShrink: 0 }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-deep)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Bot size={20} />
              </div>
              <div className="glass-panel typing-indicator" style={{ padding: '16px 24px', borderRadius: '20px', display: 'flex', gap: '4px' }}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ padding: '32px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How much is my total internet bill? Or what are the unpaid bills?" 
            style={{ 
              flex: 1, 
              background: 'var(--bg-deep)', 
              border: '1px solid var(--border)', 
              borderRadius: '16px', 
              padding: '16px 24px', 
              color: 'white', 
              outline: 'none',
              fontSize: '15px',
              transition: 'var(--transition)'
            }} 
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-neon)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: !input.trim() || isTyping ? 0.5 : 1,
              transform: isTyping ? 'scale(0.95)' : 'scale(1)'
            }}
          >
            <Send size={24} />
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .chat-session-item:hover .delete-btn {
          opacity: 1 !important;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .typing-indicator .dot {
          width: 6px;
          height: 6px;
          background: var(--text-dim);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}} />
    </div>
  );
};

export default AINexus;
