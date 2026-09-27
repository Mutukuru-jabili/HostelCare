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

export default function StudentComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!user?.id) return;
    complaintApi.getStudentComplaints(user.id)
      .then((res) => setComplaints(res.data.data || []))
      .catch(() => setComplaints([]));
  }, [user]);

  const filtered = complaints.filter((complaint) => {
    const matchesSearch = !query || complaint.title.toLowerCase().includes(query.toLowerCase()) || String(complaint.id).includes(query);
    const matchesStatus = filter === 'ALL' || complaint.status === filter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Complaints</p>
          <h2>My Complaint History</h2>
        </div>
        <Link to="/student/complaints/new" className="primary-button">+ New Complaint</Link>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by title or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="panel">
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((complaint) => (
              <tr key={complaint.id}>
                <td>#{complaint.id}</td>
                <td>{complaint.title}</td>
                <td>{complaint.category}</td>
                <td>{complaint.roomNumber}</td>
                <td><span className={`badge priority ${complaint.priority.toLowerCase()}`}>{complaint.priority}</span></td>
                <td><span className={`badge status ${statusPalette[complaint.status]}`}>{complaint.status}</span></td>
                <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                <td><Link to={`/student/complaints/${complaint.id}`} className="link-button">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
