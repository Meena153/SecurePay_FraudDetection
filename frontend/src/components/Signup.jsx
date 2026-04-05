import React, { useState } from 'react';
import { authAPI } from '../api';
import { Shield, Lock, User, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = ({ onSuccess, onToggle }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess(response.data.user);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Database may be offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]"></div>
      </div>
      
      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">
          Admin Registration
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Establish your Master Administrator credentials
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6 flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg mb-6 flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>Registration successful! Redirecting to secure dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <input
                type="text"
                className="input-field !pl-10 !py-2.5"
                placeholder="Admin username"
                value={formData.username}
                onChange={(e)=>setFormData({...formData, username:e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <input
                type="email"
                className="input-field !pl-10 !py-2.5"
                placeholder="e.g. admin@securepay.com"
                value={formData.email}
                onChange={(e)=>setFormData({...formData, email:e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <input
                type="password"
                className="input-field !pl-10 !py-2.5"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e)=>setFormData({...formData, password:e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Verify Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <input
                type="password"
                className="input-field !pl-10 !py-2.5"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={(e)=>setFormData({...formData, confirmPassword:e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading || success} className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2">
            {loading ? 'Securing Credentials...' : (
              <>
                <Shield className="w-4 h-4" />
                Initialize Admin Account
              </>
            )}
          </button>

          <div className="text-center mt-6 pt-4 border-t border-border/40">
            <button 
              type="button"
              onClick={onToggle}
              className="text-xs font-bold text-muted-foreground hover:text-white transition-colors"
            >
              Already have an account? <span className="text-primary underline underline-offset-4">Return to Login</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Signup;
