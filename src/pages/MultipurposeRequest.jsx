import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { Calendar, Clock, MapPin, Send, AlertCircle, Users } from 'lucide-react';

const MultipurposeRequest = () => {
  const { user } = useAuth();
  const { addBooking, addNotification } = useBookings();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    reason: '',
    attendees: '50',
    managerName: '',
    managerJobTitle: '',
    managerMobile: '',
    techMics: false,
    techMicsQty: '1',
    techLaptop: false,
    techVideoConf: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addNotification({
      id: Date.now(),
      message: `New Multipurpose Room request from ${user.name} for ${formData.date}`,
      date: new Date().toLocaleString(),
      type: 'request'
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ backgroundColor: '#d1fae5', color: '#065f46', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Send size={40} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Request Submitted!</h2>
        <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Your request for the Main Multipurpose Hall has been sent to the Branch Manager for approval. You will be notified once it is reviewed.
        </p>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send Another Request</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary-color)' }}>Request Multipurpose Room</h1>
        <p style={{ color: '#666' }}>Fill out the form below to request a booking for the Main Event Hall.</p>
      </header>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
          
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
              1. Event Manager Details (Internal Staff)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.managerName}
                  onChange={e => setFormData({...formData, managerName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.managerJobTitle}
                  onChange={e => setFormData({...formData, managerJobTitle: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Mobile Number</label>
              <input 
                type="number" 
                className="form-control" 
                required 
                value={formData.managerMobile}
                onChange={e => setFormData({...formData, managerMobile: e.target.value})}
              />
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
              2. Event Schedule & Size
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label"><Calendar size={16} /> Preferred Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  required 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label"><Clock size={16} /> Preferred Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  required 
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label"><Users size={16} /> Estimated Attendees</label>
              <select 
                className="form-control"
                value={formData.attendees}
                onChange={e => setFormData({...formData, attendees: e.target.value})}
              >
                <option value="50">Up to 50</option>
                <option value="100">50 - 100</option>
                <option value="200">100 - 200</option>
                <option value="500">More than 200</option>
              </select>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
              3. Technical Requirements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.techMics} 
                    onChange={e => setFormData({...formData, techMics: e.target.checked})} 
                  />
                  Mobile Microphones
                </label>
                {formData.techMics && (
                  <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Quantity:</span>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ width: '80px', padding: '0.25rem 0.5rem' }} 
                      min="1"
                      value={formData.techMicsQty}
                      onChange={e => setFormData({...formData, techMicsQty: e.target.value})}
                    />
                  </div>
                )}
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.techLaptop} 
                  onChange={e => setFormData({...formData, techLaptop: e.target.checked})} 
                />
                Laptop
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.techVideoConf} 
                  onChange={e => setFormData({...formData, techVideoConf: e.target.checked})} 
                />
                Video Conference
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Purpose of Event</label>
            <textarea 
              className="form-control" 
              rows="4" 
              placeholder="Please describe the nature of your event..."
              required
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
            ></textarea>
          </div>

          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <AlertCircle size={24} color="#856404" />
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
              <strong>Note:</strong> Multipurpose rooms require approval from the Branch Manager. Requests should be submitted at least 48 hours in advance.
            </p>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: '700', marginTop: '1rem' }}>
            Submit Booking Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default MultipurposeRequest;
