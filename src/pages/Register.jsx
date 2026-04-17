import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(id, name, password);
    if (result.success) {
      setSuccess(true);
      setError('');
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <div style={styles.container} className="animate-fade-in">
        <div className="glass-panel" style={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Registration Successful!</h2>
            <p>Your user profile has been created and is pending Admin approval.</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>AAST</div>
          <h2>إنشاء حساب جديد</h2>
          <p style={styles.subtitle}>الرجاء إدخال بياناتك للتسجيل كعضو هيئة تدريس/موظف</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">الاسم بالكامل</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="الاسم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">الرقم الوظيفي (ID)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="الرقم الوظيفي"
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
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <UserPlus size={20} /> تسجيل الحساب
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ArrowRight size={16} /> العودة لتسجيل الدخول
          </Link>
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
    maxWidth: '500px',
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
  }
};

export default Register;
