import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { complaintApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const workflow = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

export default function StudentComplaintDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    complaintApi.getComplaintById(id, user.id)
      .then((res) => setComplaint(res.data.data))
      .catch(() => setComplaint(null));
  }, [id, user]);

  if (!complaint) return <div className="page-section"><div className="panel">Complaint not found.</div></div>;

  const currentStageIndex = workflow.indexOf(complaint.status);

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

        <div className="detail-grid">
          <div className="detail-block">
            <p><strong>Description:</strong> {complaint.description}</p>
            <p><strong>Category:</strong> {complaint.category}</p>
            <p><strong>Room:</strong> {complaint.roomNumber}</p>
            <p><strong>Priority:</strong> <span className={`badge priority ${complaint.priority.toLowerCase()}`}>{complaint.priority}</span></p>
            <p><strong>Assigned Staff:</strong> {complaint.assignedStaff || 'Not assigned'}</p>
            <p><strong>Created Date:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(complaint.updatedAt).toLocaleString()}</p>
          </div>
          {complaint.imagePath ? (
            <div className="detail-image-box">
              <img src={`http://localhost:8081${complaint.imagePath}`} alt={complaint.title} />
            </div>
          ) : null}
        </div>

        <div className="workflow">
          {workflow.map((step, idx) => (
            <div key={step} className={`workflow-step ${idx <= currentStageIndex ? 'active' : ''}`}>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
