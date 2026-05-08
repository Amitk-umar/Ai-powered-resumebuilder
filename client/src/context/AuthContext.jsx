import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserWithBackend(currentUser);
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Sync user with backend
      await syncUserWithBackend(result.user);
      await fetchProfile(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncUserWithBackend(result.user);
      await fetchProfile(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/invalid-credential') message = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      return { success: false, error: message };
    }
  };

  const signUpWithEmail = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await syncUserWithBackend(result.user);
      await fetchProfile(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      let message = 'Sign up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'An account with this email already exists.';
      if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const syncUserWithBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL
        })
      });
    } catch (error) {
      console.log('Backend sync skipped (server might not be running):', error.message);
    }
  };

  const fetchProfile = async (firebaseUser = user) => {
    try {
      if (!firebaseUser) return null;
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return null;
      const data = await res.json();
      setProfile(data);
      return data;
    } catch (error) {
      console.log('Profile fetch skipped:', error.message);
      return null;
    }
  };

  const getToken = async () => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };

  const value = {
    user,
    profile,
    loading,
    signInWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout,
    getToken,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
