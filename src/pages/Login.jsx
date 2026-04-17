import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(id, password)) {
      navigate('/');
    } else {
      setError('الرقم الوظيفي أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
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
              placeholder="مثال: 1001، 1002، 1003"
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <LogIn size={20} /> دخول
          </button>
        </form>

        <div style={styles.hints}>
          <p><strong>للتجربة:</strong></p>
          <ul style={{ paddingRight: '20px' }}>
            <li>هيئة التدريس: ID 1001 / Pass 123</li>
            <li>العميد أكرم: ID 1002 / Pass 123</li>
            <li>الدكتور فيصل: ID 1003 / Pass 123</li>
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
    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    display: 'inline-block',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    fontSize: '2rem',
    fontWeight: 'bold',
    padding: '0.5rem 1.5rem',
    borderRadius: '12px',
    marginBottom: '1rem',
  },
  subtitle: {
    color: '#666',
    marginTop: '-0.5rem',
  },
  error: {
    backgroundColor: 'var(--danger)',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  hints: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#555'
  }
};

export default Login;
