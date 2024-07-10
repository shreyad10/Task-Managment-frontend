import React, { useState } from 'react';
import { login } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import './Login.css'; // Import custom CSS for additional styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA');
      return;
    }
    try {
      const response = await login({ email, password, recaptchaToken });
      toast.success(response.data.message);
      const authToken = response.data.token;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response.data.errors && error.response.data.errors.length > 0) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error('Failed to login. Please try again.');
      }
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6Lf8tAwqAAAAACtQ-HDWhjlE4Jd-Mj1l1DBXfq9x" // replace with your site key
                  onChange={handleRecaptchaChange}
                />
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
              <p className="mt-3 text-center">
                Don't have an account?{' '}
                <Link to="/register" className="btn btn-link">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
