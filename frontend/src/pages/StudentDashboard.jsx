import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusPalette = {
  PENDING: 'warning',
  ASSIGNED: 'info',
  IN_PROGRESS: 'orange',
  RESOLVED: 'success',
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    complaintApi.getStudentComplaints(user.id)
      .then((res) => setItems(res.data.data || []))
      .catch(() => setItems([]));
  }, [user]);

  const summary = {
    total: items.length,
    pending: items.filter((i) => i.status === 'PENDING').length,
    inProgress: items.filter((i) => i.status === 'IN_PROGRESS').length,
    resolved: items.filter((i) => i.status === 'RESOLVED').length,
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Student dashboard</p>
          <h2>My complaint overview</h2>
        </div>
        <Link to="/student/complaints/new" className="primary-button">+ New Complaint</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card accent">
          <span>Total Complaints</span>
          <strong>{summary.total}</strong>
        </div>
        <div className="stat-card warning">
          <span>Pending</span>
          <strong>{summary.pending}</strong>
        </div>
        <div className="stat-card info">
          <span>In Progress</span>
          <strong>{summary.inProgress}</strong>
        </div>
        <div className="stat-card success">
          <span>Resolved</span>
          <strong>{summary.resolved}</strong>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Recent Complaints</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Room</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 5).map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td><Link to={`/student/complaints/${item.id}`}>{item.title}</Link></td>
                <td>{item.category}</td>
                <td>{item.roomNumber}</td>
                <td><span className={`badge priority ${item.priority.toLowerCase()}`}>{item.priority}</span></td>
                <td><span className={`badge status ${statusPalette[item.status]}`}>{item.status}</span></td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
