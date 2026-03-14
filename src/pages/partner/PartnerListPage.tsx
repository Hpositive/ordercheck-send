import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ChevronDown } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchPartners, fetchCategories } from '../../api';
import type { Partner, Category } from '../../types';

type SortType = 'latest' | 'rating' | 'orders';

export default function PartnerListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  const sortLabel: Record<SortType, string> = {
    latest: '최신순',
    rating: '평점순',
    orders: '주문많은순',
  };

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
    <div className="min-h-screen bg-gray-50">
      <Header title={category?.name ?? '시공사 목록'} showBack />

      {/* Sort/Filter Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          총 <span className="font-semibold text-gray-900">{partners.length}</span>개
        </span>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 text-sm text-gray-700"
          >
            {sortLabel[sortType]}
            <ChevronDown size={16} />
          </button>
          {showSortDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortDropdown(false)}
              />
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]">
                {(Object.keys(sortLabel) as SortType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => handleSort(type)}
                    className={`w-full text-left px-4 py-2.5 text-sm ${
                      sortType === type
                        ? 'text-blue-600 font-semibold bg-blue-50'
                        : 'text-gray-700'
                    }`}
                  >
                    {sortLabel[type]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Partner List */}
      {loading ? (
        <Loading />
      ) : sortedPartners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-sm">등록된 시공사가 없습니다.</p>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3">
          {sortedPartners.map(partner => (
            <PartnerCard key={partner.id} partner={partner} />
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
      className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="shrink-0">
          <img
            src={partner.thumbnail}
            alt={partner.name}
            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {partner.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {partner.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({partner.reviewCount})
            </span>
            <span className="text-xs text-gray-300 mx-1">|</span>
            <span className="text-xs text-gray-500">
              주문 {partner.orderCount}건
            </span>
          </div>

          {/* Price Range */}
          <p className="text-sm text-blue-600 font-medium mt-1">
            {partner.priceRange}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">{partner.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
