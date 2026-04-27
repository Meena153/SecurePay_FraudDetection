import React, { useState, useEffect } from 'react';
import {
    User, Bell, Mail, Monitor, Save, Lock,
    Play, Square, Zap, Activity, Shield, Eye, EyeOff,
    CheckCircle, XCircle, AlertTriangle, Key, Database, BarChart2, Server
} from 'lucide-react';
import { settingsAPI } from '../api';

const Settings = ({ user, isRunning, setIsRunning, txSpeed, setTxSpeed }) => {
    const [fraudScenario, setFraudScenario] = useState('basic');
    const [profile, setProfile] = useState({
        name: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        email: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsAPI.getEmailAlertStatus();
                setNotifications(prev => ({ ...prev, email: response.data }));
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleEmailToggle = async (val) => {
        try {
            await settingsAPI.toggleEmailAlert(val);
            setNotifications({ ...notifications, email: val });
        } catch (error) {
            console.error('Failed to update email alert status:', error);
            alert('Failed to update notification settings. Please check your connection.');
        }
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        console.log('Profile updated:', profile);
        alert('Profile settings updated successfully!');
    };

    const Toggle = ({ enabled, onChange, label, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 glass-card bg-secondary/20 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${enabled ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Status: {enabled ? 'Active' : 'Disabled'}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${enabled ? 'bg-primary' : 'bg-secondary'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            
            {/* ─── Security Indicators ─── */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Security Indicators</h2>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Authentication & Authorization Matrix</p>
                    </div>
                </div>

                <div className="glass-card p-6 sm:p-10 space-y-10 border-primary/5">

                    {/* Role Badge & Info Grid */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                        {/* Visual Role Indicator */}
                        <div className="flex flex-col items-center gap-4 shrink-0">
                            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl border-2 transition-transform hover:scale-105 duration-300 ${
                                user?.role === 'Admin'
                                    ? 'bg-primary/10 border-primary/40 text-primary shadow-primary/20'
                                    : 'bg-accent/10 border-accent/40 text-accent shadow-accent/20'
                            }`}>
                                {user?.role === 'Admin' ? '👑' : '🔍'}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                                    user?.role === 'Admin'
                                        ? 'bg-primary/10 border-primary/30 text-primary'
                                        : 'bg-accent/10 border-accent/30 text-accent'
                                }`}>
                                    {user?.role || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Identity Block */}
                        <div className="flex-1 space-y-5 text-center lg:text-left w-full">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] opacity-50">Personnel Identity</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tight">{user?.username}</h3>
                                <p className="text-sm font-medium text-muted-foreground/80">{user?.email}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-2xl bg-background/40 border border-white/5">
                                    <div className={`p-2 rounded-lg ${user?.role === 'Admin' ? 'bg-primary/20' : 'bg-accent/20'}`}>
                                        <Key className={`w-4 h-4 ${user?.role === 'Admin' ? 'text-primary' : 'text-accent'}`} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] font-black uppercase opacity-40">Clearance</p>
                                        <p className={`text-xs font-bold ${user?.role === 'Admin' ? 'text-primary' : 'text-accent'}`}>
                                            {user?.role === 'Admin' ? 'LEVEL 2 — FULL ACCESS' : 'LEVEL 1 — READ ONLY'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-2xl bg-green-500/5 border border-green-500/10">
                                    <div className="p-2 rounded-lg bg-green-500/20">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] font-black uppercase opacity-40">Security Status</p>
                                        <p className="text-xs font-bold text-green-400">Authenticated & Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permission Matrix */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Permission Matrix</p>
                        
                        {/* Mobile View - List */}
                        <div className="md:hidden space-y-3">
                            {[
                                { cap: 'View Dashboard & Metrics',       icon: BarChart2,  admin: true,  analyst: true  },
                                { cap: 'View Transaction History',        icon: Database,   admin: true,  analyst: true  },
                                { cap: 'View Fraud Alerts',              icon: AlertTriangle, admin: true, analyst: true },
                                { cap: 'Reveal Masked Sensitive Data',   icon: Eye,        admin: true,  analyst: false },
                                { cap: 'Toggle Email Alerts',            icon: Mail,       admin: true,  analyst: false },
                                { cap: 'View & Export Audit Logs',       icon: Shield,     admin: true,  analyst: true  },
                                { cap: 'Clear Audit Logs',              icon: Shield,     admin: true,  analyst: false },
                                { cap: 'Start/Stop Simulation',         icon: Activity,   admin: true,  analyst: true  },
                                { cap: 'Control Simulation Parameters', icon: Zap,        admin: true,  analyst: false },
                                { cap: 'View System Infrastructure',    icon: Server,     admin: true,  analyst: false },
                                { cap: 'Configure Notification Settings',icon: Bell,       admin: true,  analyst: false },
                            ].map(({ cap, icon: Icon, admin, analyst }) => {
                                const youHave = user?.role === 'Admin' ? admin : analyst;
                                return (
                                    <div key={cap} className={`p-4 rounded-xl border border-border/40 bg-secondary/20 flex flex-col gap-3 ${youHave ? '' : 'opacity-60'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background/50 rounded-lg shrink-0">
                                                <Icon className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <p className="text-xs font-bold text-foreground">{cap}</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-border/10 pt-3">
                                            <div className="flex items-center gap-4">
                                                 <div className="flex flex-col items-center gap-1">
                                                     <p className="text-[8px] font-black uppercase opacity-40">Admin</p>
                                                     {admin ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-destructive" />}
                                                 </div>
                                                 <div className="flex flex-col items-center gap-1">
                                                     <p className="text-[8px] font-black uppercase opacity-40">Analyst</p>
                                                     {analyst ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-destructive" />}
                                                 </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <p className="text-[8px] font-black uppercase opacity-40">You</p>
                                                {youHave ? <CheckCircle className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop View - Table */}
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-border/40">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-secondary/40 border-b border-border/40">
                                        <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capability</th>
                                        <th className="px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-primary">Admin</th>
                                        <th className="px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-accent">Analyst</th>
                                        <th className="px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">You</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {[
                                        { cap: 'View Dashboard & Metrics',       icon: BarChart2,  admin: true,  analyst: true  },
                                        { cap: 'View Transaction History',        icon: Database,   admin: true,  analyst: true  },
                                        { cap: 'View Fraud Alerts',              icon: AlertTriangle, admin: true, analyst: true },
                                        { cap: 'Reveal Masked Sensitive Data',   icon: Eye,        admin: true,  analyst: false },
                                        { cap: 'Toggle Email Alerts',            icon: Mail,       admin: true,  analyst: false },
                                        { cap: 'View & Export Audit Logs',       icon: Shield,     admin: true,  analyst: true  },
                                        { cap: 'Clear Audit Logs',              icon: Shield,     admin: true,  analyst: false },
                                        { cap: 'Start/Stop Simulation',         icon: Activity,   admin: true,  analyst: true  },
                                        { cap: 'Control Simulation Parameters', icon: Zap,        admin: true,  analyst: false },
                                        { cap: 'View System Infrastructure',    icon: Server,     admin: true,  analyst: false },
                                        { cap: 'Configure Notification Settings',icon: Bell,       admin: true,  analyst: false },
                                    ].map(({ cap, icon: Icon, admin, analyst }) => {
                                        const youHave = user?.role === 'Admin' ? admin : analyst;
                                        return (
                                            <tr key={cap} className={`transition-colors hover:bg-secondary/20 ${youHave ? '' : 'opacity-60'}`}>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                        <span className="font-semibold text-xs">{cap}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    {admin ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-destructive mx-auto" />}
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    {analyst ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-destructive mx-auto" />}
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    {youHave
                                                        ? <CheckCircle className="w-4 h-4 text-primary mx-auto" />
                                                        : <XCircle className="w-4 h-4 text-destructive mx-auto" />
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {/* Masked data notice */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/40">
                        <EyeOff className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold mb-1">Data Masking Policy</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Sensitive fields (mobile numbers, full account numbers) are masked by default
                                for all users. {user?.role === 'Admin'
                                    ? 'As an Admin, you can click the eye icon next to any masked field to reveal the actual sensitive data.'
                                    : 'Only Admin-role users can reveal masked data. Contact your administrator for elevated access.'}
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Profile Settings */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <User className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Profile Settings</h2>
                </div>

                <form onSubmit={handleProfileUpdate} className="glass-card p-4 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="input-field !pl-11"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="input-field !pl-11 opacity-60 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border/40">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1 block mb-4">Change Password</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    className="input-field !pl-11"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="input-field !pl-11"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="input-field !pl-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" />
                            Update Profile
                        </button>
                    </div>
                </form>

            </section>

            {/* Notification Settings */}
            <section className={user?.role !== 'Admin' ? 'opacity-60 grayscale-[0.5]' : ''}>
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-6 h-6 text-warning" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Notification Channels</h2>
                    {user?.role !== 'Admin' && (
                        <span className="text-[10px] font-black bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20 ml-2">
                            Admin Only
                        </span>
                    )}
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${user?.role !== 'Admin' ? 'pointer-events-none' : ''}`}>
                    <Toggle
                        label="Email Alerts"
                        enabled={notifications.email}
                        onChange={user?.role === 'Admin' ? handleEmailToggle : () => {}}
                        icon={Mail}
                    />
                    {/* In-App Alerts toggle removed as sound functionality was deleted */}
                </div>

            </section>

            {/* ─── Simulation Control ─── */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                        <Activity className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Simulation Control</h2>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Traffic Generator & Parameters</p>
                    </div>
                </div>

                <div className="glass-card p-6 sm:p-10 space-y-10 border-accent/5">

                    {/* Status badge & Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col items-center sm:items-start gap-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Live Engine Status</span>
                            <span
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-500 ${
                                    isRunning
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                        : 'bg-destructive/10 text-destructive border-destructive/30'
                                }`}
                            >
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${
                                        isRunning ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-destructive'
                                    }`}
                                />
                                {isRunning ? 'ENGINE: OPERATIONAL' : 'ENGINE: STANDBY'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                id="sim-start-btn"
                                onClick={() => setIsRunning(true)}
                                disabled={isRunning}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                    isRunning
                                        ? 'opacity-40 cursor-not-allowed bg-emerald-500/5 text-emerald-500/50 border border-emerald-500/10'
                                        : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1'
                                }`}
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Start
                            </button>

                            <button
                                id="sim-stop-btn"
                                onClick={() => setIsRunning(false)}
                                disabled={!isRunning}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                    !isRunning
                                        ? 'opacity-40 cursor-not-allowed bg-destructive/5 text-destructive/50 border border-destructive/10'
                                        : 'bg-destructive hover:bg-red-500 text-white shadow-xl shadow-destructive/20 hover:shadow-red-500/40 hover:-translate-y-1'
                                }`}
                            >
                                <Square className="w-4 h-4 fill-current" />
                                Stop
                            </button>
                        </div>
                    </div>

                    <div className={`border-t border-white/5 pt-10 space-y-10 ${user?.role !== 'Admin' ? 'opacity-40 pointer-events-none grayscale-[0.6]' : ''}`}>
                        {user?.role !== 'Admin' && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
                                <Shield className="w-5 h-5 text-destructive shrink-0" />
                                <p className="text-[10px] font-black uppercase text-destructive tracking-widest leading-relaxed">
                                    Administrative Override Required: Parameter manipulation is restricted to high-clearance personnel only.
                                </p>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Fraud Scenario Dropdown */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] pl-1 block">
                                    Strategic Scenario
                                </label>
                                <div className="relative">
                                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none z-10" />
                                    <select
                                        id="fraud-scenario-select"
                                        value={fraudScenario}
                                        onChange={(e) => setFraudScenario(e.target.value)}
                                        className="input-field !pl-11 !py-4 appearance-none cursor-pointer bg-background/50 border-white/5 hover:border-primary/30 transition-all font-bold text-sm"
                                    >
                                        <option value="basic">Standard — Typical Traffic</option>
                                        <option value="high_risk">Aggressive — Elevated Fraud</option>
                                        <option value="mixed">Complex — Random Risk Profile</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                                <p className="text-[11px] text-muted-foreground/70 leading-relaxed font-medium pl-1">
                                    {fraudScenario === 'basic' && 'Optimized for verifying base detection thresholds with standard transaction patterns.'}
                                    {fraudScenario === 'high_risk' && 'Stress tests the engine by injecting high-risk international and rapid-fire signatures.'}
                                    {fraudScenario === 'mixed' && 'Simulates a diverse environment with fluctuating risk levels and unpredictable behavior.'}
                                </p>
                            </div>

                            {/* Transaction Speed Slider */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                                        Dispatch Interval
                                    </label>
                                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-black">
                                        EVERY {txSpeed}s
                                    </span>
                                </div>
                                <div className="px-1">
                                    <input
                                        id="tx-speed-slider"
                                        type="range"
                                        min={10}
                                        max={120}
                                        step={5}
                                        value={txSpeed}
                                        onChange={(e) => setTxSpeed(Number(e.target.value))}
                                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary"
                                        style={{
                                            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
                                                ((txSpeed - 10) / (120 - 10)) * 100
                                            }%, var(--color-secondary) ${
                                                ((txSpeed - 10) / (120 - 10)) * 100
                                            }%, var(--color-secondary) 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between mt-4 text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                                        <span>High Frequency (10s)</span>
                                        <span>Monitoring (120s)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            


        </div>
    );
};

export default Settings;
