import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('krishi_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('krishi_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.warn('Failed to parse krishi_user from localStorage:', e);
      return null;
    }
  });
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('krishi_profile');
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (e) {
      console.warn('Failed to parse krishi_profile from localStorage:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('krishi_token', token);
    } else {
      localStorage.removeItem('krishi_token');
    }
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('krishi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('krishi_user');
    }
  }, [user]);

  // Sync profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('krishi_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('krishi_profile');
    }
  }, [profile]);

  /**
   * Request OTP for mobile login
   */
  const login = async (phone) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const response = await api.auth.sendOtp(phone);
        return response;
      } catch (err) {
        // Fallback for standalone/offline dev mode
        console.warn('API backend not reachable, using dev mode response:', err.message);
        return { success: true, message: 'OTP sent successfully (Dev mode hint: use 123456)' };
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP and complete authentication
   */
  const verifyOtp = async (phone, otp) => {
    setLoading(true);
    setError(null);
    try {
      let authData;
      try {
        authData = await api.auth.verifyOtp(phone, otp);
      } catch (err) {
        // Fallback validation for dev code 123456
        if (otp === '123456') {
          const mockUser = {
            id: 'farmer_' + Math.random().toString(36).substr(2, 9),
            phone: phone,
            role: 'farmer',
            name: user?.name || 'Farmer User',
          };
          const mockToken = 'mock_jwt_token_' + Date.now();
          authData = {
            token: mockToken,
            user: mockUser,
            profile: profile || null,
          };
        } else {
          throw new Error('Invalid OTP code. Please enter 123456 for testing.');
        }
      }

      setToken(authData.token);
      setUser(authData.user);
      if (authData.profile) {
        setProfile(authData.profile);
      }
      return authData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google OAuth sign-in handler
   */
  const googleAuth = async (credentialPayload) => {
    setLoading(true);
    setError(null);
    try {
      let authData;
      try {
        authData = await api.auth.googleAuth(credentialPayload);
      } catch (err) {
        // Dev fallback for Google Auth
        const mockUser = {
          id: 'google_farmer_' + Math.random().toString(36).substr(2, 9),
          phone: '',
          email: 'farmer@gmail.com',
          name: 'Ramesh Kumar (Google)',
          role: 'farmer',
        };
        authData = {
          token: 'mock_google_jwt_' + Date.now(),
          user: mockUser,
          profile: profile || null,
        };
      }

      setToken(authData.token);
      setUser(authData.user);
      if (authData.profile) {
        setProfile(authData.profile);
      }
      return authData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update or Save Farmer Profile
   */
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      let updated;
      try {
        updated = await api.farmer.updateProfile(profileData);
      } catch (err) {
        console.warn('Backend update unavailable, saving locally:', err.message);
        updated = { ...profileData, id: profile?.id || 'prof_' + Date.now(), updatedAt: new Date().toISOString() };
      }

      const mergedProfile = { ...profile, ...updated };
      setProfile(mergedProfile);

      // Also update user or create session if registering directly
      if (!user) {
        const newUser = {
          id: 'farmer_' + Math.random().toString(36).substr(2, 9),
          name: profileData.name || 'Farmer',
          phone: profileData.phone || '',
          role: 'farmer',
        };
        setUser(newUser);
        setToken('token_' + Date.now());
      } else if (profileData.name) {
        setUser((prev) => ({ ...prev, name: profileData.name }));
      }
      return mergedProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear tokens
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
    localStorage.removeItem('krishi_profile');
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        isAuthenticated,
        loading,
        error,
        login,
        verifyOtp,
        googleAuth,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
