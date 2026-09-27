import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    hostelName: '',
    roomNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.register(form);
      setSuccess('Registration successful. Please login.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="brand-mark large">HC</div>
          <h2>Create Student Account</h2>
          <p>Register to raise and track hostel maintenance complaints.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          <div className="form-grid">
            <label>
              <span>Full Name</span>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              <span>Password</span>
              <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
            </label>
            <label>
              <span>Phone Number</span>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label>
              <span>Hostel/PG Name</span>
              <input type="text" name="hostelName" value={form.hostelName} onChange={handleChange} required />
            </label>
            <label>
              <span>Room Number</span>
              <input type="text" name="roomNumber" value={form.roomNumber} onChange={handleChange} required />
            </label>
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
