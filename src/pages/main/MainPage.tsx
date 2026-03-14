import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchCategories, fetchPartners } from '../../api';
import type { Category, Partner } from '../../types';

export default function MainPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [topPartners, setTopPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, allPartners] = await Promise.all([
          fetchCategories(),
          fetchPartners(),
        ]);
        setCategories(cats);
        const sorted = [...allPartners].sort((a, b) => b.rating - a.rating).slice(0, 4);
        setTopPartners(sorted);
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="오더체크" showNotification />
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
      <Header title="오더체크" showNotification />

      {/* Search Bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="시공사, 시공 종류 검색"
            readOnly
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 py-2">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-md">
          <p className="text-xs font-medium opacity-80 mb-1">인테리어 발주 플랫폼</p>
          <h2 className="text-lg font-bold leading-snug">
            인테리어 시공,<br />
            오더체크로 간편하게
          </h2>
          <p className="text-xs mt-2 opacity-70">검증된 시공사 | 실시간 견적 | 간편 발주</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">시공 카테고리</h3>
          <button
            onClick={() => navigate('/mobile/category')}
            className="flex items-center text-xs text-gray-500"
          >
            전체보기 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/mobile/category/${cat.id}`)}
              className="flex flex-col items-center gap-1 bg-white rounded-xl py-3 px-1 shadow-sm border border-gray-50 active:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-800">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Partners */}
      <div className="pt-5 pb-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="text-sm font-bold text-gray-900">인기 시공사</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {topPartners.map((partner) => {
            const cat = categories.find((c) => c.id === partner.categoryId);
            return (
              <button
                key={partner.id}
                onClick={() => navigate(`/mobile/partner/${partner.id}`)}
                className="shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left"
              >
                <div className="w-full h-28 bg-gray-100">
                  <img
                    src={partner.thumbnail}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-gray-900 truncate">{partner.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-700 font-medium">{partner.rating}</span>
                    <span className="text-[10px] text-gray-400">({partner.reviewCount})</span>
                  </div>
                  {cat && (
                    <span className="inline-block mt-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                      {cat.name}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
