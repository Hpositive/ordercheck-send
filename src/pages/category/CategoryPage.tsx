import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronRight, SearchX, X,
  Hammer, Paintbrush, Layers, LayoutGrid, DoorOpen, Plug,
  Wrench, PaintBucket, Armchair, Snowflake, Sparkles,
} from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchCategories } from '../../api';
import type { Category } from '../../types';

/* ── Icon & color maps (same as MainPage) ── */
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

const POPULAR_TAGS = ['철거', '도배', '바닥', '타일'];

export default function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = categories.filter(
    (cat) =>
      cat.name.includes(search) || cat.description.includes(search),
  );

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen">
        <Header title="시공 찾기" showBack />
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen pb-8">
      <Header title="시공 찾기" showBack />

      {/* ═══════════ Search Bar ═══════════ */}
      <div className="px-5 pt-4 pb-1 animate-fade-in-up">
        <div className="relative flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 focus-within:ring-2 focus-within:ring-blue-200 transition-shadow">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="시공사, 시공 종류 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[14px] text-gray-800 bg-transparent outline-none placeholder-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 shrink-0"
            >
              <X size={12} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════ Popular Tags ═══════════ */}
      <div className="px-5 pt-3 pb-1 animate-fade-in-up" style={{ animationDelay: '0.04s' }}>
        <p className="text-[12px] font-semibold text-gray-500 mb-2">
          추천 카테고리
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearch(tag)}
              className={`shrink-0 text-[13px] font-medium rounded-full px-4 py-1.5 transition-colors ${
                search === tag
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 active:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ Category List ═══════════ */}
      <div className="px-5 pt-4 flex flex-col gap-3 stagger-children">
        {filtered.map((cat) => {
          const colors = CATEGORY_COLORS[cat.id] || { bg: 'bg-gray-100', text: 'text-gray-600' };
          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/mobile/category/${cat.id}`)}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 text-left active:scale-[0.98] transition-transform"
            >
              {/* Icon circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl shrink-0 ${colors.bg} ${colors.text}`}
              >
                {CATEGORY_ICONS[cat.id] || <LayoutGrid size={24} />}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-gray-900">
                  {cat.name}
                </p>
                <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-block mt-2 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5">
                  시공사 {cat.count}개
                </span>
              </div>

              {/* Chevron */}
              <ChevronRight
                size={18}
                className="text-gray-300 shrink-0"
              />
            </button>
          );
        })}

        {/* ═══════════ Empty State ═══════════ */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <SearchX size={32} className="text-gray-300" />
            </div>
            <p className="text-[15px] font-semibold text-gray-500">
              검색 결과가 없습니다
            </p>
            <p className="text-[13px] text-gray-400 mt-1">
              다른 키워드로 검색해 보세요
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-[13px] font-medium text-blue-600 bg-blue-50 rounded-xl px-5 py-2 active:bg-blue-100 transition-colors"
            >
              전체 카테고리 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
