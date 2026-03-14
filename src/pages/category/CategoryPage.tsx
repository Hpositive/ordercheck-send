import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchCategories } from '../../api';
import type { Category } from '../../types';

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
    (cat) => cat.name.includes(search) || cat.description.includes(search),
  );

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="시공 찾기" showBack />
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
      <Header title="시공 찾기" showBack />

      {/* Search Bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="시공 종류 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category List */}
      <div className="px-4 pt-2 pb-6 flex flex-col gap-2.5">
        {filtered.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/mobile/category/${cat.id}`)}
            className="flex items-center gap-3.5 bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-xl shrink-0">
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                시공사 {cat.count}개
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-300 shrink-0" />
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
