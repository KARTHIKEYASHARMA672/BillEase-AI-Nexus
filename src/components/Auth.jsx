import React, { useState } from 'react';
import { useBills } from '../context/BillContext';
import { Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
  const { login, signup } = useBills();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleGoogleSuccess = (credentialResponse) => {
    setIsLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture ? null : decoded.name.charAt(0),
        picture: decoded.picture,
        plan: 'Premium Pro'
      };
      login(userData);
    } catch (error) {
      console.error("Google Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        name: isLogin ? 'John Doe' : formData.name,
        email: formData.email,
        avatar: isLogin ? 'JD' : formData.name.charAt(0),
        plan: 'Premium Pro'
      };
      
      if (isLogin) {
        login(userData);
      } else {
        signup(userData);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container bg-gradient-main" style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Elements */}
      <div style={{ 
        position: 'absolute', 
        top: '10%', 
        left: '5%', 
        width: '300px', 
        height: '300px', 
        background: 'var(--primary)', 
        filter: 'blur(150px)', 
        opacity: '0.15',
        borderRadius: '50%'
      }}></div>
      <div style={{ 
        position: 'absolute', 
        bottom: '10%', 
        right: '5%', 
        width: '400px', 
        height: '400px', 
        background: 'var(--secondary)', 
        filter: 'blur(180px)', 
        opacity: '0.1',
        borderRadius: '50%'
      }}></div>

      <div className="glass-card animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '48px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: '18px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' }}>
            {isLogin ? 'Welcome Back' : 'Join BillEase'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {isLogin ? 'Enter your details to access your dashboard' : 'Start managing your bills with AI intelligence'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 14px 14px 48px', color: 'white', outline: 'none', transition: 'var(--transition)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@company.com" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 14px 14px 48px', color: 'white', outline: 'none', transition: 'var(--transition)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              {isLogin && <a href="#" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Forgot?</a>}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 14px 14px 48px', color: 'white', outline: 'none', transition: 'var(--transition)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: '14px', 
              border: 'none', 
              background: 'var(--primary)', 
              color: 'white', 
              fontWeight: '800', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '10px',
              boxShadow: 'var(--shadow-neon)',
              transition: 'var(--transition)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
            theme="filled_black"
            shape="pill"
            width="100%"
          />
          
          <button style={{ padding: '12px', borderRadius: '30px', border: '1px solid var(--border)', background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'var(--transition)', width: '100%' }}>
            <Github size={18} /> Continue with Github
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-dim)', fontSize: '14px' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer', padding: '0 4px' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default Auth;
