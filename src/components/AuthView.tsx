import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  initialState: 'LOCKED_PASSWORD' | 'LOCKED_MFA';
  onComplete: () => void;
}

export function AuthView({ initialState, onComplete }: AuthViewProps) {
  const [step, setStep] = useState(initialState);
  const [password, setPassword] = useState('roche_admin_2026');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  // Auto-fill MFA code for prototype demonstration
  useEffect(() => {
    if (step === 'LOCKED_MFA') {
      const timer = setTimeout(() => {
        setMfaCode('046180');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleContinue = () => {
    if (step === 'LOCKED_PASSWORD') {
      setStep('LOCKED_MFA');
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#FAF9F7] flex flex-col items-center justify-center animate-fadeIn">
      {/* Subtle Background Pattern (Optional) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 relative z-10 animate-slideUp">
        
        {/* Animated Brand Logo */}
        <div className="flex flex-col items-center justify-center mb-10 shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Left Strand (Blue) */}
            <svg className="absolute w-full h-full animate-[spin_4s_linear_infinite]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13401 2 5 5.13401 5 9C5 11.205 6.01426 13.1738 7.60413 14.4578C9.52926 16.0129 12 18.25 12 22C12 18.25 14.4707 16.0129 16.3959 14.4578C17.9857 13.1738 19 11.205 19 9C19 5.13401 15.866 2 12 2Z" 
                stroke="var(--color-roche-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"/>
            </svg>
            {/* Right Strand (Cyan) */}
            <svg className="absolute w-full h-full animate-[spin_4s_linear_infinite_reverse]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C15.866 22 19 18.866 19 15C19 12.795 17.9857 10.8262 16.3959 9.54218C14.4707 7.9871 12 5.75 12 2C12 5.75 9.52926 7.9871 7.60413 9.54218C6.01426 10.8262 5 12.795 5 15C5 18.866 8.13401 22 12 22Z" 
                stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"/>
            </svg>
            {/* Center AI Node */}
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full z-10 ring-4 ring-white shadow-sm"></div>
            {/* Synaptic Dots */}
            <div className="absolute top-1 right-2 w-1 h-1 bg-[var(--color-roche-blue)] rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-3">Roche AI</h2>
        </div>

        {/* STEP 1: PASSWORD */}
        {step === 'LOCKED_PASSWORD' && (
          <div className="animate-fadeIn">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Enter your password</h1>
            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
              Enter your password for dr.mueller@roche.com
            </p>

            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-roche-blue)] focus:border-transparent transition-all shadow-sm font-mono text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              onClick={handleContinue}
              className="w-full bg-[#3B2943] hover:bg-[#2c1f32] text-white font-semibold rounded-lg py-2.5 transition-colors shadow-md mb-6"
            >
              Continue
            </button>

            <div className="text-center">
              <span className="text-[13px] text-slate-500">Can't sign in? </span>
              <a href="#" className="text-[13px] font-semibold text-[var(--color-roche-blue)] hover:underline">Reset password</a>
            </div>
          </div>
        )}

        {/* STEP 2: MFA / AUTHENTICATOR */}
        {step === 'LOCKED_MFA' && (
          <div className="animate-fadeIn">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Authenticator app</h1>
            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
              Open your verified authentication app and enter the code below
            </p>

            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-2">One-time code</label>
              <input 
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="------"
                maxLength={6}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-roche-blue)] focus:border-transparent transition-all shadow-sm font-mono text-base tracking-[0.5em] text-center"
              />
            </div>

            <button 
              onClick={handleContinue}
              disabled={mfaCode.length < 6}
              className="w-full bg-[#3B2943] hover:bg-[#2c1f32] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 transition-colors shadow-md mb-6"
            >
              Continue
            </button>

            <div className="text-center">
              <button 
                onClick={() => setStep('LOCKED_PASSWORD')}
                className="text-[13px] font-semibold text-[var(--color-roche-blue)] hover:underline"
              >
                Choose another method
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
