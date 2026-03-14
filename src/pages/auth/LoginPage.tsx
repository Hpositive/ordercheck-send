import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/mobile/main');
    } catch (e) {
      console.error('Login failed', e);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="max-w-[480px] mx-auto w-full min-h-screen bg-white flex flex-col">
      {/* Gradient Top Section */}
      <div className="relative h-[280px] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white opacity-[0.06]" />
        <div className="absolute top-20 -left-8 w-28 h-28 rounded-full bg-white opacity-[0.06]" />
        <div className="absolute bottom-10 right-16 w-20 h-20 rounded-full bg-white opacity-[0.06]" />

        {/* SVG wave at bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 480 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 20C80 45 160 0 240 25C320 50 400 10 480 30V60H0V20Z"
            fill="white"
            fillOpacity="0.08"
          />
          <path
            d="M0 35C60 15 180 55 280 30C380 5 440 40 480 25V60H0V35Z"
            fill="white"
            fillOpacity="0.05"
          />
        </svg>

        <h1 className="text-[28px] font-extrabold text-white tracking-tight relative z-10">
          준호체크
        </h1>
        <p className="text-[14px] text-white/60 mt-2 relative z-10">
          인테리어 시공 발주의 새로운 기준
        </p>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-8 relative z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-7 flex flex-col animate-fade-in-up">
        <h2 className="text-[22px] font-extrabold text-gray-900">로그인</h2>
        <p className="text-[14px] text-gray-400 mt-1 mb-6">계정 정보를 입력해 주세요</p>

        {/* Email Input */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="이메일 주소"
              className="w-full pl-11 pr-4 h-[52px] rounded-xl bg-gray-50 border border-gray-200 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호"
              className="w-full pl-11 pr-12 h-[52px] rounded-xl bg-gray-50 border border-gray-200 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mt-2.5 mb-5">
          <button className="text-[13px] text-blue-600 font-medium hover:text-blue-700 transition-colors">
            비밀번호를 잊으셨나요?
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-[52px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[15px] font-bold shadow-[0_4px_12px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[13px] text-gray-400 font-medium">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login Circles */}
        <div className="flex items-center justify-center gap-5">
          {/* Kakao */}
          <button className="w-[52px] h-[52px] rounded-full bg-[#FEE500] flex items-center justify-center active:scale-[0.98] transition-transform shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <span className="text-[#191919] text-[16px] font-extrabold leading-none">K</span>
          </button>
          {/* Naver */}
          <button className="w-[52px] h-[52px] rounded-full bg-[#03C75A] flex items-center justify-center active:scale-[0.98] transition-transform shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <span className="text-white text-[16px] font-extrabold leading-none">N</span>
          </button>
        </div>

        {/* Sign Up */}
        <div className="mt-auto pt-8 flex items-center justify-center gap-1.5">
          <span className="text-[14px] text-gray-400">아직 회원이 아니신가요?</span>
          <button className="text-[14px] text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
