import { useAuth } from '../context/AuthContext';

export default function StudentProfilePage() {
  const { user } = useAuth();

  return (
    <div className="page-section">
      <div className="panel detail-panel">
        <div className="detail-header">
          <div>
            <p className="eyebrow">Profile</p>
            <h2>{user?.fullName}</h2>
          </div>
        </div>
        <div className="detail-block" style={{ marginTop: 20 }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Hostel/PG:</strong> {user?.hostelName}</p>
          <p><strong>Room:</strong> {user?.roomNumber}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </div>
    </div>
  );
}
