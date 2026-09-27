import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(form);
      const user = response.data.data;
      setUser(user);
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message
          || (err.request ? 'Unable to connect to HostelCare. Make sure the backend is running on port 8909.' : err.message)
          || 'Unable to sign in.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-mark large">HC</div>
          <h2>Welcome to HostelCare</h2>
          <p>Sign in to manage hostel complaints efficiently.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert error">{error}</div>}
          <label>
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
        <div className="demo-box">
          <strong>Demo admin:</strong> admin@hostelcare.com / admin123
        </div>
      </div>
    </div>
  );
}
