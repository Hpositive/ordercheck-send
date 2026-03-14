import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronDown, ChevronRight, Hammer, MapPin, ShoppingBag, Check } from 'lucide-react';
import Header from '../../components/Header';
import { SkeletonList } from '../../components/Loading';
import { fetchPartners, fetchCategories } from '../../api';
import type { Partner, Category } from '../../types';

type SortType = 'latest' | 'rating' | 'orders';

const sortLabel: Record<SortType, string> = {
  latest: '최신순',
  rating: '평점순',
  orders: '주문많은순',
};

export default function PartnerListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [partnerData, categories] = await Promise.all([
        fetchPartners(categoryId),
        fetchCategories(),
      ]);
      setPartners(partnerData);
      const found = categories.find(c => c.id === categoryId);
      setCategory(found ?? null);
      setLoading(false);
    }
    load();
  }, [categoryId]);

  const sortedPartners = useMemo(() => {
    const list = [...partners];
    switch (sortType) {
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'orders':
        return list.sort((a, b) => b.orderCount - a.orderCount);
      case 'latest':
      default:
        return list;
    }
  }, [partners, sortType]);

  const handleSort = (type: SortType) => {
    setSortType(type);
    setShowSortDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Header title={category?.name ?? '시공사 목록'} showBack />

      {/* Result Count + Sort Bar */}
      <div className="bg-white px-5 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex items-center justify-between">
        <span className="text-[13px] text-gray-500">
          총 <span className="font-bold text-gray-900">{partners.length}</span>개의 시공사
        </span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 text-[13px] font-medium text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all"
          >
            {sortLabel[sortType]}
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Blur overlay */}
          {showSortDropdown && (
            <div
              className="fixed inset-0 z-10 bg-black/10 backdrop-blur-[2px] transition-opacity duration-200"
              onClick={() => setShowSortDropdown(false)}
            />
          )}

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 min-w-[140px] transition-all duration-200 origin-top-right ${
              showSortDropdown
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}
          >
            {(Object.keys(sortLabel) as SortType[]).map(type => (
              <button
                key={type}
                onClick={() => handleSort(type)}
                className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center justify-between transition-colors ${
                  sortType === type
                    ? 'text-blue-600 font-semibold bg-blue-50/60'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {sortLabel[type]}
                {sortType === type && <Check size={14} className="text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Partner List */}
      {loading ? (
        <SkeletonList count={4} />
      ) : sortedPartners.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 px-6 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <Hammer size={36} className="text-gray-300" />
          </div>
          <p className="text-[16px] font-bold text-gray-800 mb-1.5">
            아직 등록된 시공사가 없어요
          </p>
          <p className="text-[13px] text-gray-400 text-center mb-6">
            다른 카테고리에서 원하는 시공사를 찾아보세요
          </p>
          <Link
            to="/mobile/category"
            className="px-6 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/25"
          >
            다른 카테고리 보기
          </Link>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3 stagger-children">
          {sortedPartners.map((partner, idx) => (
            <div
              key={partner.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <PartnerCard partner={partner} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Link
      to={`/mobile/partner/${partner.id}`}
      className="block bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 active:scale-[0.98] transition-transform"
    >
      <div className="flex gap-3.5">
        {/* Thumbnail */}
        <div className="shrink-0">
          <img
            src={partner.thumbnail}
            alt={partner.name}
            className="w-[72px] h-[72px] rounded-xl object-cover bg-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.08)]"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-[15px] font-bold text-gray-900 truncate pr-2">
              {partner.name}
            </h3>
            <ChevronRight size={18} className="text-gray-300 shrink-0 mt-0.5" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.round(partner.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              ))}
            </div>
            <span className="text-[14px] font-bold text-gray-900">
              {partner.rating.toFixed(1)}
            </span>
            <span className="text-[12px] text-gray-400">
              리뷰 {partner.reviewCount}건
            </span>
          </div>

          {/* Stat Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[11px] font-medium text-blue-600">
              <ShoppingBag size={10} />
              주문 {partner.orderCount}건
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[11px] font-medium text-green-600">
              <MapPin size={10} />
              {partner.location}
            </span>
          </div>

          {/* Price */}
          <p className="text-[15px] text-blue-600 font-bold mt-2">
            {partner.priceRange}~
          </p>
        </div>
      </div>
    </Link>
  );
}
