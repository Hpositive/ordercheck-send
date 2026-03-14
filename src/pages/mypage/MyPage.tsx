import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  MapPin,
  CreditCard,
  BellRing,
  Megaphone,
  Headphones,
  FileText,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchCurrentUser } from '../../api';
import type { User } from '../../types';

const menuItems = [
  { icon: ClipboardList, label: '주문 관리', link: '/mobile/orders' },
  { icon: MapPin, label: '현장 관리' },
  { icon: CreditCard, label: '결제 수단 관리' },
  { icon: BellRing, label: '알림 설정' },
  { icon: Megaphone, label: '공지사항' },
  { icon: Headphones, label: '고객센터' },
  { icon: FileText, label: '이용약관' },
];

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="마이페이지" />
        <Loading />
      </div>
    );
  }

  const initials = user?.name ? user.name.slice(0, 1) : '?';

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      navigate('/mobile/login');
    }
  };

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
      <Header title="마이페이지" />

      {/* Profile Section */}
      <div className="bg-white px-4 pt-6 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user?.company}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          {[
            { label: '주문', value: '3건' },
            { label: '리뷰', value: '0건' },
            { label: '찜', value: '0건' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-900">{stat.value}</span>
              <span className="text-xs text-gray-500 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white mt-2">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const content = (
            <div
              key={item.label}
              className={`flex items-center justify-between px-4 py-3.5 active:bg-gray-50 transition-colors ${
                idx < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          );

          if (item.link) {
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.link!)}
                className="w-full text-left"
              >
                {content}
              </button>
            );
          }

          return (
            <div key={item.label} className="cursor-pointer">
              {content}
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="px-4 py-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 text-sm font-medium active:bg-gray-50 transition-colors"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </div>
  );
}
