import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, SearchX, X } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchCategories } from '../../api';
import type { Category } from '../../types';

/* ── pastel styles per category index ── */
const PASTEL_STYLES: { bg: string; ring: string }[] = [
  { bg: 'bg-red-50', ring: 'ring-red-100' },
  { bg: 'bg-orange-50', ring: 'ring-orange-100' },
  { bg: 'bg-amber-50', ring: 'ring-amber-100' },
  { bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
  { bg: 'bg-teal-50', ring: 'ring-teal-100' },
  { bg: 'bg-sky-50', ring: 'ring-sky-100' },
  { bg: 'bg-indigo-50', ring: 'ring-indigo-100' },
  { bg: 'bg-violet-50', ring: 'ring-violet-100' },
  { bg: 'bg-pink-50', ring: 'ring-pink-100' },
  { bg: 'bg-lime-50', ring: 'ring-lime-100' },
  { bg: 'bg-cyan-50', ring: 'ring-cyan-100' },
  { bg: 'bg-fuchsia-50', ring: 'ring-fuchsia-100' },
];

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
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="시공 찾기" showBack />
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen pb-8">
      <Header title="시공 찾기" showBack />

      {/* ═══════════ Search Bar ═══════════ */}
      <div className="px-5 pt-4 pb-1 animate-fade-in-up">
        <div className="relative flex items-center gap-2.5 bg-gray-100 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-200 transition-shadow">
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
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 active:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ Category List ═══════════ */}
      <div className="px-5 pt-4 flex flex-col gap-2.5 stagger-children">
        {filtered.map((cat, idx) => {
          const pastel = PASTEL_STYLES[idx % PASTEL_STYLES.length];
          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/mobile/category/${cat.id}`)}
              className="card-interactive flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm text-left"
            >
              {/* Icon circle */}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-2xl shrink-0 ring-1 ${pastel.bg} ${pastel.ring}`}
              >
                <span className="text-[28px] leading-none">{cat.icon}</span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-gray-900">
                  {cat.name}
                </p>
                <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
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
