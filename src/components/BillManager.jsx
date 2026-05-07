import React, { useState } from 'react';
import { useBills } from '../context/BillContext';
import { Plus, Search, Filter, MoreVertical, CheckCircle, Trash2, Calendar, Tag, CreditCard, Check } from 'lucide-react';

const BillManager = () => {
  const { bills, addBill, markAsPaid, deleteBill, searchQuery, setSearchQuery } = useBills();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newBill, setNewBill] = useState({ title: '', amount: '', dueDate: '', category: 'General', recurring: false });
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Electricity', 'Internet', 'Shopping', 'Rent', 'Subscriptions', 'Insurance', 'General'];

  const handleAddBill = (e) => {
    e.preventDefault();
    if (!newBill.title || !newBill.amount || !newBill.dueDate) {
      alert("Please fill in all required fields (Name, Amount, and Date)");
      return;
    }
    addBill({ ...newBill, amount: parseFloat(newBill.amount) });
    setNewBill({ title: '', amount: '', dueDate: '', category: 'General', recurring: false });
    setShowAddModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Combined Filtering Logic
  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bill.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || bill.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bill-manager animate-fade-in">
      {showSuccess && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          background: '#10b981', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '12px', 
          zIndex: 2000, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Check size={20} />
          Bill added successfully!
        </div>
      )}

      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            My <span className="text-gradient">Bills</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track all your upcoming and past payments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            padding: '12px 24px', 
            borderRadius: '14px', 
            border: 'none', 
            background: 'var(--primary)', 
            color: 'white', 
            cursor: 'pointer', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-neon)'
          }}
        >
          <Plus size={20} />
          Add New Bill
        </button>
      </header>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border)', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.01)'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bills..." 
                style={{ 
                  background: 'var(--bg-deep)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '10px', 
                  padding: '10px 16px 10px 40px',
                  color: 'var(--text-main)',
                  width: '240px',
                  outline: 'none'
                }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-dim)" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 16px', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Showing {filteredBills.length} records</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '13px' }}>BILL DETAILS</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '13px' }}>CATEGORY</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '13px' }}>DUE DATE</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '13px' }}>AMOUNT</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '13px' }}>STATUS</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '13px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }} className="table-row">
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={20} color={bill.status === 'paid' ? 'var(--text-dim)' : 'var(--primary)'} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: bill.status === 'paid' ? 'var(--text-muted)' : 'var(--text-main)' }}>{bill.title}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{bill.recurring ? 'Recurring Monthly' : 'One-time Payment'}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    color: 'var(--secondary)',
                    fontWeight: '600'
                  }}>
                    {bill.category}
                  </span>
                </td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '14px' }}>{bill.dueDate}</td>
                <td style={{ padding: '20px 24px', fontWeight: '700', color: 'var(--text-main)' }}>${bill.amount.toFixed(2)}</td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    color: bill.status === 'paid' ? '#10b981' : '#f43f5e',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: bill.status === 'paid' ? '#10b981' : '#f43f5e' }}></div>
                    {bill.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {bill.status === 'unpaid' && (
                      <button 
                        onClick={() => markAsPaid(bill.id)}
                        title="Mark as Paid"
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', transition: 'var(--transition)' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#10b981'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteBill(bill.id)}
                      title="Delete Bill"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', transition: 'var(--transition)' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#f43f5e'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBills.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No bills found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-card" style={{ width: '480px', padding: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Add New Bill</h3>
            <form onSubmit={handleAddBill}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Bill Name</label>
                <input 
                  type="text" 
                  value={newBill.title}
                  onChange={(e) => setNewBill({...newBill, title: e.target.value})}
                  placeholder="e.g. Electricity Bill" 
                  style={{ width: '100%', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', color: 'white', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Amount ($)</label>
                  <input 
                    type="number" 
                    value={newBill.amount}
                    onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                    placeholder="0.00" 
                    style={{ width: '100%', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Due Date</label>
                  <input 
                    type="date" 
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                    style={{ width: '100%', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Category</label>
                <select 
                  value={newBill.category}
                  onChange={(e) => setNewBill({...newBill, category: e.target.value})}
                  style={{ width: '100%', background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', color: 'white', outline: 'none' }}
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: 'var(--shadow-neon)' }}
                >
                  Create Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .table-row:hover {
          background: rgba(255,255,255,0.02);
        }
      `}} />
    </div>
  );
};

export default BillManager;
