import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ShoppingBag, MessageSquare } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchPartner } from '../../api';
import type { Partner } from '../../types';

type TabType = 'price' | 'portfolio' | 'review';

export default function PartnerDetailPage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('price');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPartner(partnerId!);
      setPartner(data ?? null);
      setLoading(false);
    }
    load();
  }, [partnerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="시공사 상세" showBack />
        <Loading />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="시공사 상세" showBack />
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-sm">시공사 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'price', label: '단가표' },
    { key: 'portfolio', label: '포트폴리오' },
    { key: 'review', label: '리뷰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={partner.name} showBack />

      {/* Hero Image */}
      <div className="bg-white">
        <div className="relative w-full aspect-[16/9] bg-gray-100">
          <img
            src={partner.thumbnail}
            alt={partner.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-gray-900">{partner.name}</h2>

          {/* Rating & Stats */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">
                {partner.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                리뷰 {partner.reviewCount}
              </span>
            </div>
            <span className="text-xs text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <ShoppingBag size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                주문 {partner.orderCount}건
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-2">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600">{partner.location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            {partner.description}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-12 z-30 bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === 'price' && <PriceTab partner={partner} />}
        {activeTab === 'portfolio' && <PortfolioTab partner={partner} />}
        {activeTab === 'review' && <ReviewTab partner={partner} />}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <Link
          to={`/mobile/order/create/${partner.id}`}
          className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-xl active:bg-blue-700 transition-colors"
        >
          발주하기
        </Link>
      </div>
    </div>
  );
}

/* ---- Tab Components ---- */

function PriceTab({ partner }: { partner: Partner }) {
  if (partner.priceTable.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-10">
        등록된 단가 정보가 없습니다.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500">
            <th className="text-left py-3 px-4 font-medium">항목</th>
            <th className="text-center py-3 px-4 font-medium">단위</th>
            <th className="text-right py-3 px-4 font-medium">단가</th>
          </tr>
        </thead>
        <tbody>
          {partner.priceTable.map((item, idx) => (
            <tr
              key={item.id}
              className={idx < partner.priceTable.length - 1 ? 'border-b border-gray-100' : ''}
            >
              <td className="py-3 px-4 text-gray-900">{item.item}</td>
              <td className="py-3 px-4 text-center text-gray-500">{item.unit}</td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                {item.price.toLocaleString()}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PortfolioTab({ partner }: { partner: Partner }) {
  if (partner.portfolio.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-10">
        등록된 포트폴리오가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {partner.portfolio.map(item => (
        <div key={item.id} className="rounded-xl overflow-hidden bg-white border border-gray-100">
          <div className="aspect-square bg-gray-100">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2">
            <p className="text-xs font-medium text-gray-900 truncate">
              {item.title}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewTab({ partner }: { partner: Partner }) {
  if (partner.reviews.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-10">
        등록된 리뷰가 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {partner.reviews.map(review => (
        <div
          key={review.id}
          className="bg-white rounded-xl p-4 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">
              {review.author}
            </span>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < review.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200'
                }
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {review.content}
          </p>
        </div>
      ))}
    </div>
  );
}
