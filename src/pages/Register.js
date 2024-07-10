import React, { useState } from "react";
import { register } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Register.css"; // Import custom CSS for additional styling

const Register = () => {
  const [user_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }
    try {
      const response = await register({ user_name, email, password, recaptchaToken });
      toast.success(response.data.message);
      navigate("/login");
      setName("");
      setEmail("");
      setPassword("");
      setRecaptchaToken("");
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (
        error.response.data.errors &&
        error.response.data.errors.length > 0
      ) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error("Failed to register. Please try again.");
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
            <h2 className="card-title text-center mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="user_name">User Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="user_name"
                  placeholder="Enter Name"
                  value={user_name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                />
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </div>
              <div className="text-center mt-3">
                <Link to="/login" className="btn btn-link">
                  Already have an account? Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
