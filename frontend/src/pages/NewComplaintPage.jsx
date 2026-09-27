import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const categories = ['ELECTRICAL', 'PLUMBING', 'CLEANING', 'WIFI', 'FURNITURE', 'WATER', 'ROOM_MAINTENANCE', 'OTHER'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function NewComplaintPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'ELECTRICAL',
    roomNumber: '',
    priority: 'HIGH',
    studentId: user?.id || '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await complaintApi.createComplaint({ ...form, studentId: user.id }, image);
      setSuccess('Complaint created successfully.');
      setTimeout(() => navigate('/student/complaints'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');
    }
  };

  return (
    <div className="page-section">
      <div className="page-header compact">
        <div>
          <p className="eyebrow">Student</p>
          <h2>New Complaint</h2>
        </div>
      </div>

      <div className="panel form-panel">
        <form onSubmit={handleSubmit} className="complaint-form">
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <label>
            <span>Complaint Title</span>
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            <span>Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows="5" required />
          </label>

          <div className="form-grid two-col">
            <label>
              <span>Category</span>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((category) => (
                  <option key={category} value={category}>{category.replace('_', ' ')}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Room Number</span>
              <input type="text" name="roomNumber" value={form.roomNumber} onChange={handleChange} required />
            </label>

            <label>
              <span>Priority</span>
              <select name="priority" value={form.priority} onChange={handleChange}>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Image Upload</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" className="primary-button">Submit Complaint</button>
        </form>
      </div>
    </div>
  );
}
