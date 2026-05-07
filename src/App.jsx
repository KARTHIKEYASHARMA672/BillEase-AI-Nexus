import React, { useState } from 'react';
import { BillProvider, useBills } from './context/BillContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BillManager from './components/BillManager';
import AINexus from './components/AINexus';
import Auth from './components/Auth';
import { Bell, Search, Settings, HelpCircle, X, Check, Calendar as CalendarIcon, User, Shield, CreditCard, Bell as BellIcon, Trash2, Camera, LogOut, Save, Smartphone, Mail, Lock } from 'lucide-react';

const Header = () => {
  const { searchQuery, setSearchQuery, setShowSettingsModal, setShowHelpModal, setShowNotificationsModal } = useBills();
  
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      padding: '20px 0', 
      marginBottom: '20px',
      gap: '24px'
    }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: '400px', marginRight: 'auto' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for bills, transactions, or help..." 
          style={{ 
            width: '100%', 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '16px', 
            padding: '14px 14px 14px 48px', 
            color: 'white', 
            outline: 'none',
            fontSize: '14px',
            transition: 'var(--transition)'
          }} 
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { icon: Bell, action: () => setShowNotificationsModal(true), badge: true },
          { icon: HelpCircle, action: () => setShowHelpModal(true) },
          { icon: Settings, action: () => setShowSettingsModal(true) }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={item.action}
            className="glass-panel header-btn" 
            style={{ 
              width: '48px', 
              height: '48px', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              borderRadius: '14px',
              position: 'relative',
              transition: 'var(--transition)',
              background: 'rgba(255,255,255,0.03)'
            }}
          >
            <item.icon size={20} />
            {item.badge && (
              <div style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                width: '10px', 
                height: '10px', 
                background: '#f43f5e', 
                borderRadius: '50%', 
                border: '2px solid var(--bg-deep)',
                boxShadow: '0 0 10px rgba(244, 63, 94, 0.5)'
              }}></div>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};

const Modal = ({ isOpen, onClose, title, children, width = '500px' }) => {
  if (!isOpen) return null;
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.85)', 
      backdropFilter: 'blur(12px)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{ 
        width, 
        maxWidth: '100%', 
        position: 'relative', 
        padding: '0', 
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{title}</h3>
          <button 
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ onClose }) => {
  const { logout } = useBills();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: 'John Doe', email: 'john@example.com' });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'notifications', icon: BellIcon, label: 'Alerts' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tabs.map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            style={{ 
              padding: '12px 16px', 
              borderRadius: '10px', 
              border: 'none', 
              background: activeSubTab === t.id ? 'var(--primary)' : 'transparent',
              color: activeSubTab === t.id ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              transition: 'var(--transition)'
            }}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
        <button 
          onClick={logout}
          style={{ marginTop: 'auto', padding: '12px 16px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div style={{ minHeight: '300px' }}>
        {activeSubTab === 'profile' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>JD</div>
                <button style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary)', border: '3px solid var(--bg-card)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h4 style={{ fontWeight: '700' }}>{formData.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Personal Account</p>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Display Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                />
              </div>
            </div>
            <button 
              onClick={handleSave}
              style={{ padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
        {activeSubTab === 'security' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>Two-Factor Auth</p>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Enabled (iPhone 15 Pro)</p>
              </div>
              <button style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Manage</button>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Update Password</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="password" placeholder="Current Password" style={{ width: '100%', padding: '12px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white' }} />
                <input type="password" placeholder="New Password" style={{ width: '100%', padding: '12px', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white' }} />
              </div>
            </div>
          </div>
        )}
        {activeSubTab === 'billing' && (
          <div className="animate-fade-in">
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent)' }}>
              <p style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Active Plan</p>
              <h4 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Premium Pro</h4>
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '20px' }}>$19.99 / billed monthly</p>
              <button style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>Manage Subscription</button>
            </div>
          </div>
        )}
        {activeSubTab === 'notifications' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Bill Reminders', desc: 'Get notified 3 days before due' },
              { label: 'AI Weekly Insights', desc: 'Summary of your monthly spending' },
              { label: 'Unusual Activity', desc: 'Alerts for unexpected bill increases' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.label}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.desc}</p>
                </div>
                <div style={{ width: '40px', height: '22px', borderRadius: '20px', background: 'var(--primary)', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', right: '2px', top: '2px', width: '18px', height: '18px', borderRadius: '50%', background: 'white' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CalendarView = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', fontWeight: '800' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {Array(5).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
        {days.map(d => (
          <div key={d} style={{ 
            aspectRatio: '1', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '14px', 
            borderRadius: '10px', 
            background: d === 15 ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
            color: d === 15 ? 'white' : 'var(--text-muted)',
            position: 'relative',
            border: d === 15 ? 'none' : '1px solid transparent'
          }}>
            {d}
            {[10, 15, 20].includes(d) && (
              <div style={{ position: 'absolute', bottom: '6px', width: '4px', height: '4px', borderRadius: '50%', background: d === 15 ? 'white' : 'var(--primary)' }}></div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <CalendarIcon size={16} />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: '700' }}>Rent Payment Due</p>
          <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>May 15th, 2026 • $1,200.00</p>
        </div>
      </div>
    </div>
  );
};

const NotificationsView = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {[
      { title: 'Electricity Bill Due', time: '2 hours ago', type: 'alert', desc: 'Your payment of $85.50 is due in 3 days.' },
      { title: 'Internet Payment Successful', time: 'Yesterday', type: 'success', desc: 'Successfully paid $60.00 via Visa ending in 4242.' },
      { title: 'New Feature: AI Nexus v2.0', time: '2 days ago', type: 'info', desc: 'The new Gemini brain is now active.' }
    ].map((n, i) => (
      <div key={i} className="notification-item" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', cursor: 'pointer', transition: 'var(--transition)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: n.type === 'alert' ? '#f43f5e' : 'var(--text-main)' }}>{n.title}</p>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{n.time}</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.desc}</p>
      </div>
    ))}
    <button style={{ width: '100%', padding: '12px', marginTop: '8px', color: 'var(--text-dim)', background: 'transparent', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Mark all as read</button>
  </div>
);

const AnalyticsView = () => {
  const { bills } = useBills();
  const categoryData = [
    { name: 'Rent', value: bills.filter(b => b.category === 'Rent').reduce((a, b) => a + b.amount, 0) },
    { name: 'Internet', value: bills.filter(b => b.category === 'Internet').reduce((a, b) => a + b.amount, 0) },
    { name: 'Electricity', value: bills.filter(b => b.category === 'Electricity').reduce((a, b) => a + b.amount, 0) },
    { name: 'Other', value: bills.filter(b => !['Rent', 'Internet', 'Electricity'].includes(b.category)).reduce((a, b) => a + b.amount, 0) },
  ];

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>Financial <span className="text-gradient">Analytics</span></h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Category Breakdown</h3>
          {categoryData.map(c => (
            <div key={c.name} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{c.name}</span>
                <span style={{ fontWeight: '700' }}>${c.value.toFixed(2)}</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-deep)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', width: `${Math.min(100, (c.value / 2000) * 100)}%`, boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)' }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Monthly Projection</div>
          <div style={{ fontSize: '56px', fontWeight: '900', color: 'var(--primary)', textShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}>$2,450.00</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#10b981', fontWeight: '700' }}>
            <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px', fontSize: '13px' }}>-5.2% vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(true);
  const { 
    showSettingsModal, setShowSettingsModal, 
    showHelpModal, setShowHelpModal,
    showCalendarModal, setShowCalendarModal,
    showNotificationsModal, setShowNotificationsModal,
    user
  } = useBills();

  if (!user) return <Auth />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'bills': return <BillManager />;
      case 'nexus': return <AINexus />;
      case 'analytics': return <AnalyticsView />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container bg-gradient-main">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <Header />
        <div className="view-container">
          {renderContent()}
        </div>
      </main>

      {/* Global Modals */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Account Settings" width="700px">
        <SettingsView onClose={() => setShowSettingsModal(false)} />
      </Modal>

      <Modal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} title="Help & Support Center" width="500px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Need assistance with BillEase? Search our documentation or reach out to our team.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
              <p style={{ fontWeight: '700', marginBottom: '4px' }}>Documentation</p>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Step-by-step guides</p>
            </div>
            <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
              <p style={{ fontWeight: '700', marginBottom: '4px' }}>Live Chat</p>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Speak to an expert</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)} title="Payment Calendar" width="450px">
        <CalendarView />
      </Modal>

      <Modal isOpen={showNotificationsModal} onClose={() => setShowNotificationsModal(false)} title="Notification Center" width="400px">
        <NotificationsView />
      </Modal>

      {/* Persistence Notification Bar */}
      {showNotification && (
        <div style={{ 
          position: 'fixed', 
          bottom: '32px', 
          right: '32px', 
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ 
            padding: '20px 24px', 
            borderRadius: '20px', 
            borderLeft: '4px solid #f43f5e',
            background: 'rgba(244, 63, 94, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(244, 63, 94, 0.1)'
          }}>
            <div style={{ color: '#f43f5e', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={22} /></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '15px', fontWeight: '800' }}>Critical Bill Reminder</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Your Internet bill is due in 3 days.</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', padding: '8px 16px', borderRadius: '8px' }}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .notification-item:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: var(--border) !important;
        }
        .header-btn:hover {
          background: rgba(255,255,255,0.08) !important;
          color: var(--text-main) !important;
          transform: translateY(-2px);
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
};

const App = () => {
  return (
    <BillProvider>
      <AppContent />
    </BillProvider>
  );
};

export default App;
