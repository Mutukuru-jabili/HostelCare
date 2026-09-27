import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi } from '../services/api';

const statusPalette = {
  PENDING: 'warning',
  ASSIGNED: 'info',
  IN_PROGRESS: 'orange',
  RESOLVED: 'success',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    complaintApi.getAllComplaints()
      .then((res) => setComplaints(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Could not load complaints.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = complaints.filter((complaint) => {
    const matchesQuery = !query || complaint.title.toLowerCase().includes(query.toLowerCase()) || complaint.student?.fullName?.toLowerCase().includes(query.toLowerCase()) || complaint.roomNumber.toLowerCase().includes(query.toLowerCase()) || String(complaint.id).includes(query);
    const matchesStatus = status === 'ALL' || complaint.status === status;
    const matchesPriority = priority === 'ALL' || complaint.priority === priority;
    return matchesQuery && matchesStatus && matchesPriority;
  });

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>All Complaints</h2>
        </div>
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}
      <div className="toolbar admin-toolbar">
        <input type="search" placeholder="Search by ID, title, student, room" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">Filter Status</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="ALL">Filter Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="panel">
        {loading ? <p>Loading complaints...</p> : filtered.length === 0 ? <p>No complaints match these filters.</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student details</th>
              <th>Room</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((complaint) => (
              <tr key={complaint.id}>
                <td>#{complaint.id}</td>
                <td className="student-cell">
                  <strong>{complaint.student?.fullName}</strong>
                  <span>{complaint.student?.email}</span>
                  <span>{complaint.student?.phone}</span>
                  <span>{complaint.student?.hostelName}</span>
                  <span>Registered room: {complaint.student?.roomNumber}</span>
                </td>
                <td>{complaint.roomNumber}</td>
                <td>{complaint.category}</td>
                <td><span className={`badge priority ${complaint.priority.toLowerCase()}`}>{complaint.priority}</span></td>
                <td><span className={`badge status ${statusPalette[complaint.status]}`}>{complaint.status}</span></td>
                <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                <td><Link to={`/admin/complaints/${complaint.id}`} className="link-button">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
