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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-14">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
