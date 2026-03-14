import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  ChevronRight,
  Bell,
  ShoppingCart,
  BarChart3,
  Building2,
  ClipboardList,
  Quote,
  MapPin,
} from 'lucide-react';
import Loading from '../../components/Loading';
import { fetchCategories, fetchPartners } from '../../api';
import type { Category, Partner } from '../../types';

/* ── pastel background colors per category index ── */
const PASTEL_BG = [
  'bg-red-50',
  'bg-orange-50',
  'bg-amber-50',
  'bg-emerald-50',
  'bg-teal-50',
  'bg-sky-50',
  'bg-indigo-50',
  'bg-violet-50',
  'bg-pink-50',
  'bg-lime-50',
  'bg-cyan-50',
  'bg-fuchsia-50',
];

/* ── mock reviews (aggregated from partners) ── */
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
      try {
        const [cats, partners] = await Promise.all([
          fetchCategories(),
          fetchPartners(),
        ]);
        setCategories(cats);
        setAllPartners(partners);
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoading(false);
      }
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
      p.reviews.forEach((r) =>
        reviews.push({ ...r, partnerName: p.name }),
      ),
    );
    return reviews.slice(0, 8);
  }, [allPartners]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100/80">
          <div className="flex items-center justify-between h-[56px] px-5">
            <span className="text-[19px] font-extrabold gradient-text tracking-tight">
              준호체크
            </span>
            <div className="w-9 h-9" />
          </div>
        </header>
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen pb-8">
      {/* ═══════════ Custom Header ═══════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100/60">
        <div className="flex items-center justify-between h-[56px] px-5">
          <span className="text-[19px] font-extrabold gradient-text tracking-tight select-none">
            준호체크
          </span>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-red-500 rounded-full ring-2 ring-white animate-pulse-dot" />
          </button>
        </div>
      </header>

      {/* ═══════════ Search Bar ═══════════ */}
      <div className="px-5 pt-4 pb-1 animate-fade-in-up">
        <button
          onClick={() => navigate('/mobile/category')}
          className="w-full flex items-center gap-2.5 bg-gray-100 rounded-2xl px-4 py-3 shadow-sm"
        >
          <Search size={18} className="text-gray-400 shrink-0" />
          <span className="text-[14px] text-gray-400 font-normal">
            시공사, 시공 종류 검색
          </span>
        </button>
      </div>

      {/* ═══════════ Banner ═══════════ */}
      <div className="px-5 pt-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-lg overflow-hidden">
          {/* Decorative SVG Pattern */}
          <svg
            className="absolute top-0 right-0 w-48 h-48 opacity-10"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="160" cy="40" r="80" fill="white" />
            <circle cx="140" cy="80" r="50" fill="white" />
            <circle cx="180" cy="120" r="30" fill="white" />
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-32 h-32 opacity-[0.07]"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="40" cy="160" r="70" fill="white" />
            <circle cx="20" cy="140" r="40" fill="white" />
          </svg>

          <p className="relative text-xs font-medium text-white/80 mb-1.5 tracking-wide">
            인테리어 발주 플랫폼
          </p>
          <h2 className="relative text-[18px] font-bold leading-[1.45]">
            인테리어 시공,
            <br />
            준호체크로 간편하게
          </h2>
          <p className="relative text-[12px] mt-2 text-white/70 leading-relaxed">
            검증된 시공사 &middot; 실시간 견적 &middot; 간편 발주
          </p>
          <button
            onClick={() => navigate('/mobile/category')}
            className="relative mt-4 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 active:bg-white/10 backdrop-blur-sm text-white text-[13px] font-semibold rounded-xl px-4 py-2 transition-colors"
          >
            둘러보기
            <ChevronRight size={15} className="mt-px" />
          </button>
        </div>
      </div>

      {/* ═══════════ Quick Actions ═══════════ */}
      <div className="px-5 pt-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                icon: <ShoppingCart size={22} className="text-blue-600" />,
                label: '발주하기',
                to: '/mobile/category',
              },
              {
                icon: <BarChart3 size={22} className="text-emerald-600" />,
                label: '단가비교',
                to: '/mobile/category',
              },
              {
                icon: <Building2 size={22} className="text-violet-600" />,
                label: '시공사찾기',
                to: '/mobile/category',
              },
              {
                icon: <ClipboardList size={22} className="text-orange-500" />,
                label: '내주문',
                to: '/mobile/orders',
              },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.to)}
                className="flex flex-col items-center gap-2 py-2 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50">
                  {action.icon}
                </div>
                <span className="text-[12px] font-medium text-gray-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ Category Grid ═══════════ */}
      <div className="px-5 pt-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-[15px] font-bold text-gray-900">시공 카테고리</h3>
          <button
            onClick={() => navigate('/mobile/category')}
            className="flex items-center text-[12px] text-gray-400 font-medium"
          >
            전체보기
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 stagger-children">
          {categories.slice(0, 8).map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/mobile/category/${cat.id}`)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-2xl ${PASTEL_BG[idx % PASTEL_BG.length]}`}
              >
                <span className="text-[26px] leading-none">{cat.icon}</span>
              </div>
              <span className="text-[12px] font-medium text-gray-700">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ Popular Partners (horizontal scroll) ═══════════ */}
      <div className="pt-7 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between px-5 mb-3.5">
          <h3 className="text-[15px] font-bold text-gray-900">인기 시공사</h3>
          <button
            onClick={() => navigate('/mobile/category')}
            className="flex items-center text-[12px] text-gray-400 font-medium"
          >
            더보기
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {topPartners.map((partner) => {
            const cat = categories.find((c) => c.id === partner.categoryId);
            return (
              <button
                key={partner.id}
                onClick={() => navigate(`/mobile/partner/${partner.id}`)}
                className="shrink-0 w-[200px] bg-white rounded-2xl shadow-sm overflow-hidden text-left card-interactive"
              >
                {/* Image with gradient overlay */}
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                  <img
                    src={partner.thumbnail}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Price badge */}
                  <span className="absolute top-2.5 right-2.5 text-[11px] font-bold text-white bg-black/40 backdrop-blur-sm rounded-lg px-2 py-0.5">
                    {partner.priceRange}
                  </span>
                  {/* Name + location on overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <p className="text-[14px] font-bold text-white truncate drop-shadow-sm">
                      {partner.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-white/80" />
                      <span className="text-[11px] text-white/80">
                        {partner.location}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Info section */}
                <div className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      <Star
                        size={13}
                        className="text-amber-400 fill-amber-400"
                      />
                      <span className="text-[13px] font-bold text-gray-900">
                        {partner.rating}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      리뷰 {partner.reviewCount}
                    </span>
                  </div>
                  {cat && (
                    <span className="inline-block mt-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5">
                      {cat.name}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════ Recent Reviews (horizontal scroll) ═══════════ */}
      <div className="pt-7 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between px-5 mb-3.5">
          <h3 className="text-[15px] font-bold text-gray-900">최근 시공 후기</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide">
          {recentReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="shrink-0 w-[240px] bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between"
            >
              <div>
                <Quote size={18} className="text-blue-200 mb-2" />
                <p className="text-[13px] text-gray-700 leading-relaxed line-clamp-3">
                  {review.content}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-gray-800">
                    {review.author}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {review.partnerName}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={
                        i < Math.round(review.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200'
                      }
                    />
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
