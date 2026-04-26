import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FloatingOrbs from '../components/FloatingOrbs';
import { FcGoogle } from 'react-icons/fc';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import './Auth.css';

const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /\d/.test(p) },
  { label: 'One special character (@$!%*?&)', test: (p) => /[@$!%*?&]/.test(p) },
];

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const isPasswordStrong = strongRegex.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordStrong) {
      setError('Password does not meet security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signUpWithEmail(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <FloatingOrbs />
      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Start building your dream resume today</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <div className="input-with-icon">
                <HiUser className="input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email</label>
              <div className="input-with-icon">
                <HiMail className="input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div className="input-with-icon">
                <HiLockClosed className="input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>

              {/* Password strength rules */}
              {(passwordFocused || password.length > 0) && (
                <ul className="password-rules">
                  {passwordRules.map((rule, i) => (
                    <li key={i} className={rule.test(password) ? 'rule-pass' : 'rule-fail'}>
                      {rule.test(password) ? <HiCheckCircle /> : <HiXCircle />}
                      {rule.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
              <div className="input-with-icon">
                <HiLockClosed className="input-icon" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`password-match ${passwordsMatch ? 'match-yes' : 'match-no'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading || !isPasswordStrong || !passwordsMatch}
            >
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> : 'Create Account'}
            </button>
          </form>

          <div className="divider">or continue with</div>

          <button type="button" className="btn btn-google btn-lg" onClick={handleGoogleSignIn} disabled={loading}>
            <FcGoogle size={22} />
            Sign up with Google
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
