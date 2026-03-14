import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, ChevronRight, Bell, ShoppingCart, BarChart3,
  Building2, ClipboardList, MapPin, Hammer, Paintbrush, LayoutGrid,
  Plug, Wrench, PaintBucket, DoorOpen, Armchair, Snowflake, Sparkles,
  Quote, Layers,
} from 'lucide-react';
import { fetchCategories, fetchPartners } from '../../api';
import type { Category, Partner } from '../../types';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  demolition: <Hammer size={24} />,
  wallpaper: <Paintbrush size={24} />,
  flooring: <Layers size={24} />,
  tile: <LayoutGrid size={24} />,
  carpentry: <DoorOpen size={24} />,
  electrical: <Plug size={24} />,
  plumbing: <Wrench size={24} />,
  painting: <PaintBucket size={24} />,
  window: <DoorOpen size={24} />,
  furniture: <Armchair size={24} />,
  aircon: <Snowflake size={24} />,
  cleaning: <Sparkles size={24} />,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  demolition: { bg: 'bg-red-100', text: 'text-red-600' },
  wallpaper: { bg: 'bg-orange-100', text: 'text-orange-600' },
  flooring: { bg: 'bg-amber-100', text: 'text-amber-700' },
  tile: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  carpentry: { bg: 'bg-teal-100', text: 'text-teal-600' },
  electrical: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  plumbing: { bg: 'bg-sky-100', text: 'text-sky-600' },
  painting: { bg: 'bg-violet-100', text: 'text-violet-600' },
  window: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  furniture: { bg: 'bg-pink-100', text: 'text-pink-600' },
  aircon: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  cleaning: { bg: 'bg-lime-100', text: 'text-lime-600' },
};

interface SimpleReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  partnerName: string;
}

export default function MainPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [cats, partners] = await Promise.all([fetchCategories(), fetchPartners()]);
      setCategories(cats);
      setAllPartners(partners);
      setLoading(false);
    }
    load();
  }, []);

  const topPartners = useMemo(
    () => [...allPartners].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [allPartners],
  );

  const recentReviews = useMemo<SimpleReview[]>(() => {
    const reviews: SimpleReview[] = [];
    allPartners.forEach((p) =>
      p.reviews.forEach((r) => reviews.push({ ...r, partnerName: p.name })),
    );
    return reviews.slice(0, 8);
  }, [allPartners]);

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen">
        <_Header />
        <div className="px-5 pt-6 space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen pb-10">
      <_Header />

      {/* Search */}
      <div className="px-5 pt-4">
        <button
          onClick={() => navigate('/mobile/category')}
          className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100"
        >
          <Search size={18} className="text-gray-300" />
          <span className="text-[14px] text-gray-400">시공사, 시공 종류 검색</span>
        </button>
      </div>

      {/* Banner */}
      <div className="px-5 pt-4">
        <div className="relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(37,99,235,0.2)]">
          <div className="bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-6 pb-7">
            <svg className="absolute top-0 right-0 w-56 h-56 opacity-[0.08]" viewBox="0 0 200 200" fill="none">
              <circle cx="160" cy="30" r="90" fill="white" />
              <circle cx="180" cy="100" r="50" fill="white" />
            </svg>
            <svg className="absolute -bottom-4 -left-4 w-36 h-36 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
              <circle cx="40" cy="160" r="80" fill="white" />
            </svg>
            <p className="relative text-[11px] font-semibold text-white/60 uppercase tracking-[0.1em] mb-2">
              인테리어 발주 플랫폼
            </p>
            <h2 className="relative text-[20px] font-extrabold text-white leading-[1.4]">
              인테리어 시공,<br />준호체크로 간편하게
            </h2>
            <p className="relative text-[12px] mt-2 text-white/50">
              검증된 시공사 · 실시간 견적 · 간편 발주
            </p>
            <button
              onClick={() => navigate('/mobile/category')}
              className="relative mt-5 inline-flex items-center gap-1 bg-white text-[#4f46e5] text-[13px] font-bold rounded-xl px-5 py-2.5 shadow-md active:scale-95 transition-transform"
            >
              둘러보기 <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 pt-5">
        <div className="bg-white rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.05)] p-5">
          <div className="grid grid-cols-4 gap-1">
            {[
              { icon: <ShoppingCart size={20} />, label: '발주하기', to: '/mobile/category', color: 'text-blue-600 bg-blue-50' },
              { icon: <BarChart3 size={20} />, label: '단가비교', to: '/mobile/category', color: 'text-emerald-600 bg-emerald-50' },
              { icon: <Building2 size={20} />, label: '시공사찾기', to: '/mobile/category', color: 'text-violet-600 bg-violet-50' },
              { icon: <ClipboardList size={20} />, label: '내주문', to: '/mobile/orders', color: 'text-orange-500 bg-orange-50' },
            ].map((a) => (
              <button key={a.label} onClick={() => navigate(a.to)} className="flex flex-col items-center gap-2 py-1 active:scale-95 transition-transform">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${a.color}`}>
                  {a.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-600">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="px-5 pt-7">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-extrabold text-gray-900">시공 카테고리</h3>
          <button onClick={() => navigate('/mobile/category')} className="flex items-center text-[12px] text-gray-400 font-medium">
            전체보기 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          {categories.slice(0, 8).map((cat) => {
            const colors = CATEGORY_COLORS[cat.id] || { bg: 'bg-gray-100', text: 'text-gray-600' };
            return (
              <button key={cat.id} onClick={() => navigate(`/mobile/category/${cat.id}`)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${colors.bg} ${colors.text}`}>
                  {CATEGORY_ICONS[cat.id] || <LayoutGrid size={24} />}
                </div>
                <span className="text-[12px] font-semibold text-gray-700">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Partners */}
      <div className="pt-8">
        <div className="flex items-center justify-between px-5 mb-4">
          <h3 className="text-[16px] font-extrabold text-gray-900">인기 시공사</h3>
          <button onClick={() => navigate('/mobile/category')} className="flex items-center text-[12px] text-gray-400 font-medium">
            더보기 <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {topPartners.map((partner) => {
            const cat = categories.find((c) => c.id === partner.categoryId);
            return (
              <button key={partner.id} onClick={() => navigate(`/mobile/partner/${partner.id}`)}
                className="shrink-0 w-[180px] bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden text-left active:scale-[0.97] transition-transform">
                <div className="relative w-full aspect-[4/3] bg-gray-200">
                  <img src={partner.thumbnail} alt={partner.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-white bg-black/50 backdrop-blur rounded-md px-2 py-0.5">
                    {partner.priceRange}
                  </span>
                  <div className="absolute bottom-2.5 left-3">
                    <p className="text-[14px] font-bold text-white drop-shadow">{partner.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-white/70" />
                      <span className="text-[10px] text-white/70">{partner.location}</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-[13px] font-bold text-gray-900">{partner.rating}</span>
                    <span className="text-[11px] text-gray-400 ml-0.5">({partner.reviewCount})</span>
                  </div>
                  {cat && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                      {cat.name}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="pt-8">
        <div className="px-5 mb-4">
          <h3 className="text-[16px] font-extrabold text-gray-900">최근 시공 후기</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide">
          {recentReviews.map((review, idx) => (
            <div key={`${review.id}-${idx}`}
              className="shrink-0 w-[220px] bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-4 flex flex-col justify-between border border-gray-50">
              <div>
                <Quote size={16} className="text-blue-300 mb-2" />
                <p className="text-[13px] text-gray-600 leading-[1.6] line-clamp-3">{review.content}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-gray-800">{review.author}</p>
                  <p className="text-[10px] text-gray-400">{review.partnerName}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10}
                      className={i < Math.round(review.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function _Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
      <div className="flex items-center justify-between h-[56px] px-5">
        <span className="text-[20px] font-extrabold gradient-text tracking-tight select-none">준호체크</span>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <Bell size={21} className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
