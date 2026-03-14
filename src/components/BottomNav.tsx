import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ClipboardList, User } from 'lucide-react';

const navItems = [
  { path: '/mobile/main', label: '홈', icon: Home },
  { path: '/mobile/category', label: '시공찾기', icon: Search },
  { path: '/mobile/orders', label: '주문내역', icon: ClipboardList },
  { path: '/mobile/mypage', label: '마이', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/95 backdrop-blur-md border-t border-gray-100 z-50">
      <div className="flex justify-around items-center h-[56px]">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-[3px] py-1.5 px-4 transition-all duration-200"
            >
              <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  className={`transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                />
                {isActive && (
                  <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight transition-colors duration-200 ${
                isActive ? 'font-bold text-blue-600' : 'font-medium text-gray-400'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
