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

interface MenuGroup {
  title: string;
  items: {
    icon: typeof ClipboardList;
    label: string;
    link?: string;
    color: string;
    bg: string;
  }[];
}

const menuGroups: MenuGroup[] = [
  {
    title: '주문 / 시공',
    items: [
      { icon: ClipboardList, label: '주문 관리', link: '/mobile/orders', color: 'text-blue-600', bg: 'bg-blue-100' },
      { icon: MapPin, label: '현장 관리', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ],
  },
  {
    title: '결제',
    items: [
      { icon: CreditCard, label: '결제 수단 관리', color: 'text-violet-600', bg: 'bg-violet-100' },
    ],
  },
  {
    title: '설정',
    items: [
      { icon: BellRing, label: '알림 설정', color: 'text-amber-600', bg: 'bg-amber-100' },
      { icon: Megaphone, label: '공지사항', color: 'text-pink-600', bg: 'bg-pink-100' },
      { icon: Headphones, label: '고객센터', color: 'text-cyan-600', bg: 'bg-cyan-100' },
      { icon: FileText, label: '이용약관', color: 'text-gray-600', bg: 'bg-gray-100' },
    ],
  },
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
      <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen">
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
    <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen animate-fade-in-up">
      <Header title="마이페이지" />

      {/* Gradient Banner + Profile */}
      <div className="relative">
        <div className="h-36 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
          {/* Subtle radial pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/[0.06] -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/[0.04] translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="flex flex-col items-center -mt-10 relative z-10">
          {/* Avatar */}
          <div className="w-[76px] h-[76px] rounded-full ring-4 ring-white bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-[26px] font-bold text-white">{initials}</span>
          </div>

          {/* User Info */}
          <div className="mt-3 text-center px-5">
            <h2 className="text-[20px] font-extrabold text-gray-900">{user?.name}</h2>
            <p className="text-[14px] text-gray-500 mt-0.5">{user?.company}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mx-5 -mt-2 relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 px-2 py-4 mt-4">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { label: '주문', value: 3 },
              { label: '리뷰', value: 0 },
              { label: '찜', value: 0 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-[22px] font-extrabold text-gray-900">{stat.value}</span>
                <span className="text-[12px] text-gray-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="mt-5 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 pt-5 pb-2">
              {group.title}
            </p>
            <div className="bg-white rounded-2xl mx-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 overflow-hidden">
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === group.items.length - 1;

                const row = (
                  <div
                    className={`flex items-center justify-between px-5 py-3.5 active:bg-gray-50 transition-colors ${
                      !isLast ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}>
                        <Icon size={16} className={item.color} />
                      </div>
                      <span className="text-[14px] font-medium text-gray-800">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                );

                if (item.link) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.link!)}
                      className="w-full text-left"
                    >
                      {row}
                    </button>
                  );
                }

                return (
                  <div key={item.label} className="cursor-pointer">
                    {row}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mx-5 pt-5 pb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 bg-white text-[14px] font-medium text-gray-500 hover:text-red-500 hover:border-red-200 active:bg-red-50 active:scale-[0.98] transition-all"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </div>

      {/* App Version */}
      <p className="text-center text-[12px] text-gray-300 pb-10">준호체크 v1.0.0</p>
    </div>
  );
}
