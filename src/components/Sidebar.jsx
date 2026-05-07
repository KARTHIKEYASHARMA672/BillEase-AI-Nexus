import React from 'react';
import { Home, Receipt, PieChart, MessageSquare, Bell, Settings, Plus, History } from 'lucide-react';
import { useBills } from '../context/BillContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { setShowSettingsModal, sessions, setActiveSessionId, user } = useBills();
  
  const handleHistoryClick = (id) => {
    setActiveTab('nexus');
    setActiveSessionId(id);
  };
  
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'bills', icon: Receipt, label: 'My Bills' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'nexus', icon: MessageSquare, label: 'AI Nexus' },
  ];

  return (
    <div className="glass-panel sidebar" style={{ 
      width: '280px', 
      height: 'calc(100vh - 40px)', 
      margin: '20px', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '24px',
      borderRight: '1px solid var(--border)'
    }}>
      <div className="logo-container" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-neon)'
        }}>
          <Receipt size={24} color="white" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Bill<span style={{ color: 'var(--primary)' }}>Ease</span>
        </h1>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {menuItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: activeTab === item.id ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                  color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  textAlign: 'left',
                  fontSize: '15px',
                  fontWeight: activeTab === item.id ? '600' : '500'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '40px' }}>
          <p style={{ 
            fontSize: '12px', 
            textTransform: 'uppercase', 
            color: 'var(--text-dim)', 
            fontWeight: '700',
            letterSpacing: '1px',
            marginBottom: '16px',
            paddingLeft: '16px'
          }}>
            History
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.slice(0, 3).map(session => (
              <div 
                key={session.id}
                onClick={() => handleHistoryClick(session.id)}
                className="history-item" 
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '12px', 
                  fontSize: '13px', 
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}
              >
                <History size={14} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer" style={{ 
        marginTop: 'auto', 
        paddingTop: '20px', 
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: 'var(--border-bright)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {user?.picture ? (
            <img src={user.picture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '14px', fontWeight: '700' }}>{user?.avatar || 'JD'}</span>
          )}
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name || 'John Doe'}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{user?.plan || 'Premium Plan'}</p>
        </div>
        <Settings 
          size={18} 
          onClick={() => setShowSettingsModal(true)}
          style={{ marginLeft: 'auto', color: 'var(--text-dim)', cursor: 'pointer', transition: 'var(--transition)' }} 
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .history-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }
      `}} />
    </div>
  );
};

export default Sidebar;
