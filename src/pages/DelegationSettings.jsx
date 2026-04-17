import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Check, X } from 'lucide-react';

const DelegationSettings = () => {
  const { user, users, promoteUser, addDelegation, setOverride, approveDelegation, revokeDelegation } = useAuth();
  
  // States for Branch Manager Executive Authority
  const branchManageableUsers = Object.values(users).filter(u => u.role !== 'branch_manager' && u.id !== user.id);
  const [promoTarget, setPromoTarget] = useState(branchManageableUsers[0]?.id || '');
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');

  // States for Admin User Management
  const adminManageableUsers = Object.values(users).filter(u => u.id !== user.id && u.role !== 'branch_manager');
  const [adminManageTarget, setAdminManageTarget] = useState(adminManageableUsers[0]?.id || '');

  const pendingDelegations = Object.values(users).flatMap(u => 
    (u.delegations || [])
       .filter(d => d.status === 'pending')
       .map(d => ({ ...d, targetUserId: u.id, targetUserName: u.name, delegatorName: users[d.delegatorId]?.name }))
  );

  // States for Employee/Secretary Peer Delegation
  const availablePeers = Object.values(users).filter(u => (u.role === 'employee' || u.role === 'secretary') && u.id !== user.id);
  const [delTarget, setDelTarget] = useState('');
  const [delStart, setDelStart] = useState('');
  const [delEnd, setDelEnd] = useState('');

  // Handlers for Branch Manager
  const handlePermanentPromo = () => {
    if (!promoTarget) return;
    promoteUser(promoTarget, 'admin');
    alert(`User ${promoTarget} permanently elevated to Admin.`);
  };

  const handleTempPromo = () => {
    if (!promoTarget || !tempStart || !tempEnd) return alert("Please specify a target user and a valid start/end date matrix.");
    if (tempEnd < tempStart) return alert("End date must be chronologically after the start date.");
    addDelegation(promoTarget, { delegatorId: user.id, roleGranted: 'admin', startDate: tempStart, endDate: tempEnd }, true);
    alert(`User ${promoTarget} granted temporary Admin privileges from ${tempStart} to ${tempEnd}.`);
    setTempStart(''); setTempEnd('');
  };

  // Handlers for Admin
  const handleToggleOverride = (overrideKey) => {
    if (!adminManageTarget) return;
    const currentVal = users[adminManageTarget]?.overrides?.[overrideKey] || false;
    setOverride(adminManageTarget, overrideKey, !currentVal);
  };

  // Handlers for Employee/Secretary
  const handleDelegateSubmit = (e) => {
    e.preventDefault();
    if (!delTarget || !delStart || !delEnd) return alert("Please configure the target substitute and date matrix.");
    if (delEnd < delStart) return alert("End date must be chronologically after start date.");
    addDelegation(delTarget, { delegatorId: user.id, roleGranted: user.role === 'secretary' ? 'secretary' : 'employee', startDate: delStart, endDate: delEnd }, false);
    alert(`Delegation request sent to System Admin. ${users[delTarget]?.name} will inherit substituting rights once approved.`);
    setDelTarget(''); setDelStart(''); setDelEnd('');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <h1 style={{ marginTop: '2rem' }}>Authority & Delegations</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Configure structural leave delegations and system permissions.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        
        {/* Branch Manager Block */}
        {user.role === 'branch_manager' && (
          <div className="glass-panel" style={{ borderTop: '4px solid #10b981' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#10b981' }}>
              <ShieldAlert size={20} /> Executive Authority Assignments
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Permanently upgrade personnel to Admins or designate custom users as temporary Admins during leave periods.</p>
            
            <div className="form-group">
              <label className="form-label">Target Personnel</label>
              <select className="form-control" value={promoTarget} onChange={(e) => setPromoTarget(e.target.value)}>
                {branchManageableUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label">Temporary Start Date</label>
                <input type="date" className="form-control" value={tempStart} onChange={(e) => setTempStart(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Temporary End Date</label>
                <input type="date" className="form-control" value={tempEnd} onChange={(e) => setTempEnd(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1, borderColor: '#10b981', color: '#10b981' }} onClick={handleTempPromo}>Assign Temp Admin</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: '#10b981', border: 'none' }} onClick={handlePermanentPromo}>Force Permanent Upgrade</button>
            </div>
          </div>
        )}

        {/* Admin Block */}
        {user.role === 'admin' && (
          <>
            <div className="glass-panel" style={{ borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                <Users size={20} /> Granular Account Security
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Adjust physical overrides for specific users below their architectural tier, or inherit access matrices.</p>
              
              <div className="form-group">
                <label className="form-label">Target Account</label>
                <select className="form-control" value={adminManageTarget} onChange={(e) => setAdminManageTarget(e.target.value)}>
                  {adminManageableUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>

              <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '1rem', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#444' }}>Micro-Overrides Applied:</h4>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                   <input type="checkbox" checked={users[adminManageTarget]?.overrides?.['viewMasterRegistry'] || false} onChange={() => handleToggleOverride('viewMasterRegistry')} style={{ width: '1.2rem', height: '1.2rem' }} />
                   <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enable Master UI Tables (View-Only)</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                   <input type="checkbox" checked={users[adminManageTarget]?.overrides?.['enableGlobalEditing'] || false} onChange={() => handleToggleOverride('enableGlobalEditing')} style={{ width: '1.2rem', height: '1.2rem' }} />
                   <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#cc0000' }}>Enable Master Registry Target Editing (Execution Authority)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                   <input type="checkbox" checked={users[adminManageTarget]?.overrides?.['enableApprovals'] || false} onChange={() => handleToggleOverride('enableApprovals')} style={{ width: '1.2rem', height: '1.2rem' }} />
                   <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981' }}>De-centralize Frontline Approvals (Accept/Reject Requests)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                   <input type="checkbox" checked={users[adminManageTarget]?.overrides?.['bypassLeadTimes'] || false} onChange={() => handleToggleOverride('bypassLeadTimes')} style={{ width: '1.2rem', height: '1.2rem' }} />
                   <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Revoke 24hr / 48hr Submission Blockers</span>
                </label>
              </div>
            </div>

            {pendingDelegations.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>Pending Delegation Routings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {pendingDelegations.map(del => (
                    <div key={del.id} className="glass-panel" style={{ borderLeft: '4px solid #8b5cf6', padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{del.delegatorName} ➔ {del.targetUserName}</h4>
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#666' }}>Valid from {del.startDate} to {del.endDate}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-success" onClick={() => approveDelegation(del.targetUserId, del.id)} style={{ flex: 1 }}><Check size={16} /> Approve</button>
                        <button className="btn btn-danger" onClick={() => revokeDelegation(del.targetUserId, del.id)} style={{ flex: 1 }}><X size={16} /> Discard</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Employee / Secretary Block */}
        {(user.role === 'employee' || user.role === 'secretary') && (
          <div className="glass-panel" style={{ borderTop: '4px solid #8b5cf6' }}>
             <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
               <Users size={20} /> Leave Period Delegation
             </h3>
             <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Designate a peer to inherit visibility of your operations during an absence.</p>
             <form onSubmit={handleDelegateSubmit}>
               <div className="form-group">
                 <label className="form-label">Select Substitute Colleague</label>
                 <select className="form-control" value={delTarget} onChange={(e) => setDelTarget(e.target.value)} required>
                    <option value="">-- Choose Colleague --</option>
                    {availablePeers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
                 </select>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                 <div><label className="form-label">Start Date</label><input type="date" className="form-control" value={delStart} onChange={e => setDelStart(e.target.value)} required /></div>
                 <div><label className="form-label">End Date</label><input type="date" className="form-control" value={delEnd} onChange={e => setDelEnd(e.target.value)} required /></div>
               </div>
               <button type="submit" className="btn" style={{ width: '100%', backgroundColor: '#8b5cf6', color: 'white', border: 'none' }}>Submit Block to Admin</button>
             </form>

             {user.delegations && user.delegations.length > 0 && (
               <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Pending & Active Operations:</h4>
                  {user.delegations.map(d => { return null; })}
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DelegationSettings;
