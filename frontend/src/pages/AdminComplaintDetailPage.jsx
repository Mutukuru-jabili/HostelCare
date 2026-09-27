import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiBaseUrl, complaintApi } from '../services/api';

export default function AdminComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [staff, setStaff] = useState('');

  useEffect(() => {
    complaintApi.getComplaintById(id)
      .then((res) => {
        const found = res.data.data;
        setComplaint(found);
        setStatus(found.status);
        setPriority(found.priority);
        setStaff(found.assignedStaff || '');
      })
      .catch((err) => setLoadError(err.response?.data?.message || 'Could not load this complaint.'))
      .finally(() => setLoading(false));
  }, [id]);

  const saveChanges = async (type, value) => {
    if (!complaint) return;
    setSaving(type);
    setActionMessage('');
    setActionError('');
    try {
      let response;
      if (type === 'status') response = await complaintApi.updateStatus(complaint.id, value);
      if (type === 'priority') response = await complaintApi.updatePriority(complaint.id, value);
      if (type === 'staff') response = await complaintApi.assignStaff(complaint.id, value);
      const updated = response.data.data;
      setComplaint(updated);
      setStatus(updated.status);
      setPriority(updated.priority);
      setStaff(updated.assignedStaff || '');
      setActionMessage('Complaint updated successfully.');
    } catch (err) {
      if (type === 'status') setStatus(complaint.status);
      if (type === 'priority') setPriority(complaint.priority);
      if (type === 'staff') setStaff(complaint.assignedStaff || '');
      setActionError(err.response?.data?.message || 'Could not update this complaint.');
    } finally {
      setSaving('');
    }
  };

  if (loading) return <div className="page-section"><div className="panel">Loading complaint...</div></div>;
  if (!complaint) return <div className="page-section"><div className="alert error" role="alert">{loadError || 'Complaint not found.'}</div></div>;

  return (
    <div className="page-section">
      <div className="panel detail-panel">
        <div className="detail-header">
          <div>
            <p className="eyebrow">Complaint #{complaint.id}</p>
            <h2>{complaint.title}</h2>
          </div>
          <span className={`badge status ${complaint.status === 'PENDING' ? 'warning' : complaint.status === 'ASSIGNED' ? 'info' : complaint.status === 'IN_PROGRESS' ? 'orange' : 'success'}`}>{complaint.status}</span>
        </div>

        {actionMessage && <div className="alert success" role="status">{actionMessage}</div>}
        {actionError && <div className="alert error" role="alert">{actionError}</div>}

        <div className="detail-grid">
          <div className="detail-block">
            <p><strong>Student:</strong> {complaint.student?.fullName}</p>
            <p><strong>Email:</strong> {complaint.student?.email}</p>
            <p><strong>Phone:</strong> {complaint.student?.phone}</p>
            <p><strong>Hostel/PG:</strong> {complaint.student?.hostelName}</p>
            <p><strong>Registered room:</strong> {complaint.student?.roomNumber}</p>
            <p><strong>Complaint room:</strong> {complaint.roomNumber}</p>
            <p><strong>Category:</strong> {complaint.category}</p>
            <p><strong>Priority:</strong> {complaint.priority}</p>
            <p><strong>Assigned Staff:</strong> {complaint.assignedStaff || 'Not assigned'}</p>
            <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
            <p><strong>Description:</strong> {complaint.description}</p>
          </div>
          {complaint.imagePath ? (
            <div className="detail-image-box">
              <img src={`${apiBaseUrl.replace(/\/api\/?$/, '')}${complaint.imagePath}`} alt={complaint.title} />
            </div>
          ) : null}
        </div>

        <div className="admin-actions">
          <label>
            <span>Assigned Maintenance Staff</span>
            <select value={staff} disabled={Boolean(saving)} onChange={(e) => { setStaff(e.target.value); saveChanges('staff', e.target.value); }}>
              <option value="">Select staff</option>
              <option value="Electrical Staff">Electrical Staff</option>
              <option value="Plumbing Staff">Plumbing Staff</option>
              <option value="Cleaning Staff">Cleaning Staff</option>
              <option value="General Maintenance Staff">General Maintenance Staff</option>
            </select>
          </label>

          <label>
            <span>Status</span>
            <select value={status} disabled={Boolean(saving)} onChange={(e) => { setStatus(e.target.value); saveChanges('status', e.target.value); }}>
              <option value="PENDING">PENDING</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </label>

          <label>
            <span>Priority</span>
            <select value={priority} disabled={Boolean(saving)} onChange={(e) => { setPriority(e.target.value); saveChanges('priority', e.target.value); }}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
