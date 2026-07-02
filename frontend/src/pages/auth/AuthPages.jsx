import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH } from '../../constants/testIds';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';

const DEMO_ACCOUNTS = [
  { key: 'state_admin',      title: 'State Admin',         subtitle: 'P. Bharathi, IAS',      username: 'state_admin',      password: 'Admin@123' },
  { key: 'department_officer', title: 'Department Officer', subtitle: 'Dr. Anjali Desai',       username: 'dept_officer',     password: 'Health@123' },
  { key: 'district_officer', title: 'District Collector',  subtitle: 'Rakesh Patel, IAS',      username: 'district_officer', password: 'District@123' },
  { key: 'citizen',          title: 'Citizen',             subtitle: 'Priya Shah',             username: 'citizen',          password: 'Citizen@123' },
];

export const Login = () => {
  const [role, setRole] = useState('state_admin');
  const [username, setUsername] = useState('state_admin');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const pickRole = (k) => {
    const a = DEMO_ACCOUNTS.find((x) => x.key === k);
    if (a) { setUsername(a.username); setPassword(a.password); setRole(k); setErr(''); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      await login(username, password);
      nav(role === 'citizen' ? '/portal/view-family' : '/dashboard/state');
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left visual */}
      <div className="hidden lg:flex relative flex-col justify-between p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <Icons.Layers size={22} />
          </div>
          <div>
            <div className="font-heading font-bold text-lg">GCSR • Digital Gujarat</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">State Data Lakehouse</div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300 mb-3">Government of Gujarat</div>
          <h1 className="font-heading font-black text-4xl md:text-5xl leading-[1.05] tracking-tight">
            Gujarat Common Social Registry
          </h1>
          <p className="mt-5 text-slate-300 text-[15px] max-w-md leading-relaxed">
            One Citizen. One Member ID. One Family. One Family ID. A unified state data lakehouse
            connecting 46 departments, 33 districts, and 6.4 crore citizens.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: '6.42 Cr', l: 'Citizens' },
              { k: '1.38 Cr', l: 'Golden Families' },
              { k: '48,392 Cr', l: 'DBT Disbursed' },
            ].map((s) => (
              <div key={s.l} className="rounded-lg glass-dark border border-white/10 p-3">
                <div className="text-cyan-300 font-heading font-bold text-lg">{s.k}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5"><Icons.ShieldCheck size={12} /> Aadhaar-secured</span>
          <span className="flex items-center gap-1.5"><Icons.Lock size={12} /> RBAC + Consent</span>
          <span className="flex items-center gap-1.5"><Icons.Cpu size={12} /> Mistral AI</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Icons.Layers size={22} className="text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-slate-900">GCSR</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">State Lakehouse</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-heading font-bold text-3xl tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in with your GCSR credentials to continue.</p>
          </div>

          <Tabs value={role} onValueChange={pickRole} className="mb-5">
            <TabsList className="grid grid-cols-4 h-auto bg-slate-100 p-1">
              {DEMO_ACCOUNTS.map((a) => (
                <TabsTrigger
                  key={a.key}
                  value={a.key}
                  data-testid={AUTH.loginRoleTab(a.key)}
                  className="text-[11px] py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {a.title.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Username</label>
              <Input
                data-testid={AUTH.loginUsername}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                <Link to="/forgot" className="text-[11px] text-indigo-600 hover:underline">Forgot?</Link>
              </div>
              <Input
                data-testid={AUTH.loginPassword}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>

            {err && (
              <div className="text-[12.5px] text-rose-700 bg-rose-50 border border-rose-100 rounded-md px-3 py-2 flex items-center gap-2">
                <Icons.AlertCircle size={14} /> {err}
              </div>
            )}

            <Button type="submit" disabled={loading} data-testid={AUTH.loginSubmit}
                    className="w-full h-11 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white shadow-md">
              {loading ? <Icons.Loader2 className="animate-spin" size={16} /> : <>Sign in <Icons.ArrowRight className="ml-1.5" size={15} /></>}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">Demo accounts pre-filled</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => pickRole(a.key)}
                  className={`text-left px-3 py-2 rounded-md border transition-all ${
                    role === a.key ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-medium">{a.title}</div>
                  <div className="text-slate-500 text-[10.5px] font-mono">{a.username}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Screen 2: MFA ----------
export const MFA = () => {
  const [otp, setOtp] = useState('');
  const nav = useNavigate();
  const submit = (e) => { e.preventDefault(); if (otp) nav('/dashboard/state'); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 grid-bg">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card-hover border border-slate-200 p-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center mb-5 shadow-lg mx-auto">
          <Icons.KeyRound size={22} className="text-white" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-center text-slate-900">Two-factor authentication</h2>
        <p className="text-sm text-slate-500 text-center mt-1">Enter the 6-digit code from your authenticator app.<br/><span className="text-[11px] text-indigo-600">Demo OTP: 482913</span></p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input
            data-testid={AUTH.mfaInput}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            className="h-12 text-center font-mono text-xl tracking-[0.5em]"
            maxLength={6}
          />
          <Button data-testid={AUTH.mfaVerify} type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">Verify & continue</Button>
        </form>
      </div>
    </div>
  );
};

// ---------- Screen 4: Forgot password ----------
export const ForgotPassword = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 grid-bg">
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-card p-8">
      <Icons.Mail size={28} className="text-indigo-600 mb-4" />
      <h2 className="font-heading font-bold text-2xl text-slate-900">Reset your password</h2>
      <p className="text-sm text-slate-500 mt-1">We'll email a reset link to your registered address.</p>
      <div className="mt-6 space-y-3">
        <Input placeholder="official@gcsr.gujarat.gov.in" className="h-11" />
        <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800">Send reset link</Button>
        <Link to="/login" className="block text-center text-[12px] text-indigo-600 hover:underline">← Back to sign in</Link>
      </div>
    </div>
  </div>
);

// ---------- Screen 3: Role Selection ----------
export const RoleSelection = () => {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 grid-bg p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl tracking-tight text-slate-900">Choose your workspace</h2>
          <p className="text-sm text-slate-500 mt-1">Your credentials grant access to multiple roles. Pick one to continue.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.key}
              onClick={() => nav('/dashboard/state')}
              className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center">
                  <Icons.User size={18} />
                </div>
                <div>
                  <div className="font-heading font-semibold text-slate-900">{a.title}</div>
                  <div className="text-[12px] text-slate-500">{a.subtitle}</div>
                </div>
                <Icons.ArrowRight size={16} className="ml-auto text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
