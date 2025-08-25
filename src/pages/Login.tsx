import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Chrome, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';   // ✅ keep from fix-footer-scroll
import { supabase } from '../lib/supabase';                 // ✅ keep from main

const Login: React.FC = () => {
  useScrollToTop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const { login, loginWithGoogle, enableDemoMode } = useAuth();
  const navigate = useNavigate();

  // ... keep rest of your file exactly the same
};

export default Login;
