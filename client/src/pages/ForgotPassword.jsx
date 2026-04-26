import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import FloatingOrbs from '../components/FloatingOrbs';
import { HiMail, HiArrowLeft, HiCheckCircle } from 'react-icons/hi';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <FloatingOrbs />
      <div className="auth-container">
        <div className="auth-card glass-card">
          {sent ? (
            /* Success State */
            <div className="forgot-success">
              <div className="forgot-success-icon">
                <HiCheckCircle />
              </div>
              <h2>Check Your Email</h2>
              <p>We've sent a password reset link to:</p>
              <p className="forgot-email-sent">{email}</p>
              <p className="forgot-note">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                className="btn btn-primary btn-lg auth-submit"
                onClick={() => { setSent(false); setEmail(''); }}
              >
                Try Another Email
              </button>
              <p className="auth-footer">
                <Link to="/login" className="auth-link">
                  <HiArrowLeft style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Back to Sign In
                </Link>
              </p>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="auth-header">
                <h1>Forgot Password?</h1>
                <p>Enter your email and we'll send you a reset link</p>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">Email Address</label>
                  <div className="input-with-icon">
                    <HiMail className="input-icon" />
                    <input
                      id="forgot-email"
                      type="email"
                      className="form-input"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                  {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> : 'Send Reset Link'}
                </button>
              </form>

              <p className="auth-footer">
                Remember your password? <Link to="/login" className="auth-link">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
