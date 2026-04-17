import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(id, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.overlay}></div>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>AAST</div>
          <h2>تسجيل الدخول</h2>
          <p style={styles.subtitle}>نظام إدارة وحجز القاعات</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">الرقم الوظيفي (ID)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="مثال: 1, 2, 3, 4"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password (123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            تسجيل الدخول
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>ليس لديك حساب؟</p>
          <Link to="/register" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
            <UserPlus size={20} /> إنشاء حساب جديد
          </Link>
        </div>

        <div style={styles.hints}>
          <p><strong>بيانات التجربة:</strong></p>
          <ul style={{ paddingRight: '20px', listStyleType: 'none' }}>
            <li>🔑 <strong>Admin:</strong> ID 1</li>
            <li>👔 <strong>Manager:</strong> ID 2</li>
            <li>🎓 <strong>Dean:</strong> ID 1003</li>
            <li>📂 <strong>Secretary:</strong> ID 1002, 1005</li>
            <li>👨‍🏫 <strong>Employee:</strong> ID 1001, 1004, 1006</li>
            <li><small>كلمة المرور لجميع الحسابات: <strong>123</strong></small></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    background: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069") center/cover no-repeat',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(2, 48, 71, 0.85) 0%, rgba(255, 183, 3, 0.2) 100%)',
    zIndex: -1,
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  logo: {
    display: 'inline-block',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    fontSize: '2.2rem',
    fontWeight: '900',
    padding: '0.6rem 2rem',
    borderRadius: '16px',
    marginBottom: '1.2rem',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  subtitle: {
    color: '#444',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '0.8rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid #fecaca',
  },
  hints: {
    marginTop: '2.5rem',
    padding: '1.2rem',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: '16px',
    fontSize: '0.85rem',
    color: '#4b5563',
    border: '1px solid #e5e7eb',
  }
};

export default Login;
