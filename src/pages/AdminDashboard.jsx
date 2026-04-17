import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, X, UserCog, UserCheck, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const { user, users, approveUser, rejectUser } = useAuth();

  const allUsersArray = Object.values(users);
  const pendingUsers = allUsersArray.filter(u => u.status === 'pending');
  const approvedUsers = allUsersArray.filter(u => u.status === 'approved' && u.id !== 'admin');

  const getRoleName = (role) => {
    switch (role) {
      case 'staff': return 'هيئة التدريس / موظف';
      case 'dean': return 'عميد الكلية';
      case 'faisal': return 'رئيس الأكاديمية';
      case 'admin': return 'مدير النظام';
      default: return role;
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>لوحة تحكم مدير النظام / {user.name}</h1>
          <p style={{ color: '#666' }}>إدارة حسابات المستخدمين والصلاحيات</p>
        </div>
        <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{pendingUsers.length}</span>
          <span style={{ marginRight: '0.5rem', color: '#666' }}>حسابات معلقة</span>
        </div>
      </div>

      <div style={styles.grid}>
        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <ShieldAlert size={20} color="var(--danger)" /> حسابات بانتظار الموافقة
          </h3>
          
          {pendingUsers.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <UserCheck size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#888' }}>لا توجد حسابات جديدة بانتظار موافقتك حالياً.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingUsers.map(u => (
                <div key={u.id} className="glass-panel" style={{ borderLeft: '4px solid var(--danger)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>
                      {u.name}
                    </h4>
                    <span className="badge" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger)' }}>قيد المراجعة</span>
                  </div>
                  
                  <div style={styles.userDetails}>
                    <p><strong>الرقم الوظيفي:</strong> {u.id}</p>
                    <p><strong>الدور:</strong> {getRoleName(u.role)}</p>
                  </div>
                  
                  <div style={styles.actions}>
                    <button onClick={() => approveUser(u.id)} className="btn btn-success" style={{ flex: 1, backgroundColor: 'var(--success)' }}>
                      <Check size={18} /> موافقة
                    </button>
                    <button onClick={() => rejectUser(u.id)} className="btn btn-danger" style={{ flex: 1 }}>
                      <X size={18} /> رفض وحذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <UserCog size={20} color="var(--primary-color)" /> المستخدمين المعتمدين
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {approvedUsers.map(u => (
               <div key={u.id} className="glass-panel" style={{ opacity: 0.9, padding: '1rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{u.name}</strong>
                    <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>{getRoleName(u.role)}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                    <span>الرقم الوظيفي: {u.id}</span>
                    <button onClick={() => rejectUser(u.id)} style={styles.deleteBtn}>حذف الحساب</button>
                  </div>
               </div>
             ))}
             {approvedUsers.length === 0 && <p style={{ color: '#888' }}>لا يوجد مستخدمين معتمدين حالياً.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(350px, 2fr) minmax(300px, 1fr)',
    gap: '2rem',
    alignItems: 'start',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    fontSize: '0.95rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    textDecoration: 'underline'
  }
};

export default AdminDashboard;
