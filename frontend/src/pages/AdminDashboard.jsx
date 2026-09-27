import { useEffect, useState } from 'react';
import { complaintApi } from '../services/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    complaintApi.getStatistics()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load complaint statistics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h2>Operations overview</h2>
        </div>
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}
      {loading && <p>Loading complaint statistics...</p>}

      <div className="stats-grid">
        <div className="stat-card accent"><span>Total Complaints</span><strong>{stats.total}</strong></div>
        <div className="stat-card warning"><span>Pending</span><strong>{stats.pending}</strong></div>
        <div className="stat-card info"><span>Assigned</span><strong>{stats.assigned}</strong></div>
        <div className="stat-card orange"><span>In Progress</span><strong>{stats.inProgress}</strong></div>
        <div className="stat-card success"><span>Resolved</span><strong>{stats.resolved}</strong></div>
      </div>
    </div>
  );
}
