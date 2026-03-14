import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      alert('로그인 성공!');
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
      {/* Logo Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
            오더체크
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            인테리어 시공 발주의 새로운 기준
          </p>
        </div>

        {/* Form */}
        <div className="w-full space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="이메일"
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="비밀번호"
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold active:bg-blue-700 disabled:opacity-50 transition-colors mt-1"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-5">
          <button className="text-xs text-gray-500">회원가입</button>
          <span className="text-gray-300">|</span>
          <button className="text-xs text-gray-500">비밀번호 찾기</button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mt-8 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">간편 로그인</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <div className="w-full space-y-2.5">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FEE500] text-[#191919] text-sm font-semibold active:brightness-95 transition-all">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 1C4.58 1 1 3.8 1 7.28c0 2.22 1.48 4.17 3.7 5.27-.16.6-.58 2.16-.67 2.5-.1.42.16.41.33.3.13-.09 2.1-1.43 2.95-2.01.55.08 1.11.12 1.69.12 4.42 0 8-2.8 8-6.18C17 3.8 13.42 1 9 1z"
                fill="#191919"
              />
            </svg>
            카카오로 시작하기
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#03C75A] text-white text-sm font-semibold active:brightness-95 transition-all">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M15.67 1H2.33C1.6 1 1 1.6 1 2.33v13.34C1 16.4 1.6 17 2.33 17h13.34c.73 0 1.33-.6 1.33-1.33V2.33C17 1.6 16.4 1 15.67 1zM6.27 12.53H4.73V7.4H3.47V6.13h4.07V7.4H6.27v5.13zm7.07 0h-1.4l-2.8-4.47v4.47H7.73V6.13h1.4l2.8 4.47V6.13h1.41v6.4z"
                fill="#fff"
              />
            </svg>
            네이버로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
