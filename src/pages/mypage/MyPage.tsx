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
  Edit3,
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
      { icon: ClipboardList, label: '주문 관리', link: '/mobile/orders', color: 'text-blue-600', bg: 'bg-blue-50' },
      { icon: MapPin, label: '현장 관리', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ],
  },
  {
    title: '결제',
    items: [
      { icon: CreditCard, label: '결제 수단 관리', color: 'text-violet-600', bg: 'bg-violet-50' },
    ],
  },
  {
    title: '설정',
    items: [
      { icon: BellRing, label: '알림 설정', color: 'text-orange-500', bg: 'bg-orange-50' },
      { icon: Megaphone, label: '공지사항', color: 'text-pink-500', bg: 'bg-pink-50' },
      { icon: Headphones, label: '고객센터', color: 'text-cyan-600', bg: 'bg-cyan-50' },
      { icon: FileText, label: '이용약관', color: 'text-gray-500', bg: 'bg-gray-100' },
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
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen animate-fade-in-up">
      <Header title="마이페이지" />

      {/* Gradient Banner + Profile */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="relative px-5 -mt-10 pb-5">
          {/* Avatar */}
          <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>

          {/* User Info */}
          <div className="mt-3 flex items-start justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user?.company}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            </div>
            <button className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 active:bg-gray-50 transition-colors shadow-sm">
              <Edit3 size={12} />
              프로필 수정
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 -mt-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/60 px-2 py-4">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { label: '주문', value: 3 },
              { label: '리뷰', value: 0 },
              { label: '찜', value: 0 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-xs text-gray-400 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 mt-5 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 pl-1">
              {group.title}
            </p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/60 overflow-hidden">
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === group.items.length - 1;

                const row = (
                  <div
                    className={`flex items-center justify-between px-4 py-3.5 active:bg-gray-50 transition-colors ${
                      !isLast ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
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

      {/* App Version */}
      <p className="text-center text-xs text-gray-400 mt-8">준호체크 v1.0.0</p>

      {/* Logout Button */}
      <div className="px-4 pt-3 pb-10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-400 text-sm font-medium hover:text-red-500 hover:border-red-200 active:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </div>
    </div>
  );
}
