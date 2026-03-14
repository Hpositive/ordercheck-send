import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ShoppingBag, MessageSquare, Phone, ChevronDown, Image as ImageIcon } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchPartner } from '../../api';
import type { Partner } from '../../types';

type TabType = 'price' | 'portfolio' | 'review';

const tabs: { key: TabType; label: string }[] = [
  { key: 'price', label: '단가표' },
  { key: 'portfolio', label: '포트폴리오' },
  { key: 'review', label: '리뷰' },
];

export default function PartnerDetailPage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('price');
  const [descExpanded, setDescExpanded] = useState(false);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPartner(partnerId!);
      setPartner(data ?? null);
      setLoading(false);
    }
    load();
  }, [partnerId]);

  // Slide the tab indicator
  useEffect(() => {
    const idx = tabs.findIndex(t => t.key === activeTab);
    const tabEl = tabRefs.current[idx];
    const indicator = tabIndicatorRef.current;
    if (tabEl && indicator) {
      indicator.style.width = `${tabEl.offsetWidth}px`;
      indicator.style.left = `${tabEl.offsetLeft}px`;
    }
  }, [activeTab, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Header title="시공사 상세" showBack />
        <Loading />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Header title="시공사 상세" showBack />
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ImageIcon size={28} className="text-gray-300" />
          </div>
          <p className="text-[14px] font-medium">시공사 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const descriptionLong = partner.description && partner.description.length > 80;

  return (
    <div className="min-h-screen bg-[#f7f8fa] pb-24">
      <Header title={partner.name} showBack transparent />

      {/* Hero Image with Gradient Overlay */}
      <div className="relative w-full aspect-[16/9] bg-gray-200 -mt-[52px]">
        <img
          src={partner.thumbnail}
          alt={partner.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <h2 className="text-[22px] font-bold text-white drop-shadow-lg">
            {partner.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="text-[15px] font-bold text-white">
              {partner.rating.toFixed(1)}
            </span>
            <span className="text-[13px] text-white/70 ml-0.5">
              ({partner.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Info Chips Row */}
      <div className="bg-white px-4 py-3.5 flex gap-2 overflow-x-auto scrollbar-hide animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-[12px] font-semibold text-green-700 whitespace-nowrap shrink-0">
          <MapPin size={13} />
          {partner.location}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[12px] font-semibold text-blue-700 whitespace-nowrap shrink-0">
          <ShoppingBag size={13} />
          주문 {partner.orderCount}건
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-[12px] font-semibold text-amber-700 whitespace-nowrap shrink-0">
          <MessageSquare size={13} />
          리뷰 {partner.reviewCount}건
        </span>
      </div>

      {/* Description */}
      {partner.description && (
        <div className="bg-white px-5 pb-4 -mt-px animate-fade-in-up">
          <div className="border-t border-gray-100 pt-3.5">
            <p
              className={`text-[13px] text-gray-600 leading-[1.7] transition-all duration-300 ${
                !descExpanded && descriptionLong ? 'line-clamp-2' : ''
              }`}
            >
              {partner.description}
            </p>
            {descriptionLong && (
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="flex items-center gap-0.5 mt-1.5 text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                {descExpanded ? '접기' : '더보기'}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${descExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sticky Tab Navigation */}
      <div className="sticky top-[52px] z-30 bg-white border-b border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="relative flex">
          {tabs.map((tab, idx) => (
            <button
              key={tab.key}
              ref={el => { tabRefs.current[idx] = el; }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3.5 text-[14px] font-semibold text-center transition-colors relative ${
                activeTab === tab.key
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
          {/* Sliding indicator */}
          <div
            ref={tabIndicatorRef}
            className="absolute bottom-0 h-[2.5px] bg-blue-600 rounded-full transition-all duration-300 ease-out"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {activeTab === 'price' && <PriceTab partner={partner} />}
        {activeTab === 'portfolio' && <PortfolioTab partner={partner} />}
        {activeTab === 'review' && <ReviewTab partner={partner} />}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-14 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 z-30">
        <div className="flex gap-2.5">
          <a
            href="tel:"
            className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <Phone size={20} className="text-gray-600" />
          </a>
          <Link
            to={`/mobile/order/create/${partner.id}`}
            className="flex-1 flex items-center justify-center h-[52px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[15px] font-bold rounded-2xl active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
          >
            발주하기
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---- Tab Components ---- */

function PriceTab({ partner }: { partner: Partner }) {
  if (partner.priceTable.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-400">
        <p className="text-[13px]">등록된 단가 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left py-3.5 px-4 font-semibold text-blue-900/70">항목</th>
              <th className="text-center py-3.5 px-3 font-semibold text-blue-900/70 w-16">단위</th>
              <th className="text-right py-3.5 px-4 font-semibold text-blue-900/70 w-24">단가</th>
            </tr>
          </thead>
          <tbody>
            {partner.priceTable.map((item, idx) => (
              <tr
                key={item.id}
                className={`${idx % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'} ${
                  idx < partner.priceTable.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <td className="py-3.5 px-4 text-gray-800 font-medium">{item.item}</td>
                <td className="py-3.5 px-3 text-center text-gray-500">{item.unit}</td>
                <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                  {item.price.toLocaleString()}<span className="text-gray-500 font-normal">원</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PortfolioTab({ partner }: { partner: Partner }) {
  if (partner.portfolio.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-400">
        <p className="text-[13px]">등록된 포트폴리오가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 animate-fade-in-up">
      <div className="grid grid-cols-2 gap-2.5">
        {partner.portfolio.map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 group"
          >
            <div className="relative bg-gray-100 aspect-[4/3]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[13px] font-bold text-white drop-shadow-md truncate">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-[11px] text-white/75 truncate mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewTab({ partner }: { partner: Partner }) {
  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1
    partner.reviews.forEach(r => {
      const clamped = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[5 - clamped]++;
    });
    return counts;
  }, [partner.reviews]);

  const maxCount = Math.max(...ratingBreakdown, 1);

  if (partner.reviews.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-400">
        <p className="text-[13px]">등록된 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3 animate-fade-in-up">
      {/* Rating Summary Card */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60">
        <div className="flex gap-5">
          {/* Left: big number */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="text-[40px] font-extrabold text-gray-900 leading-none">
              {partner.rating.toFixed(1)}
            </div>
            <div className="flex items-center gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(partner.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              {partner.reviewCount}개의 리뷰
            </p>
          </div>

          {/* Right: bar chart breakdown */}
          <div className="flex-1 space-y-1.5 justify-center flex flex-col">
            {ratingBreakdown.map((count, idx) => {
              const starNum = 5 - idx;
              return (
                <div key={starNum} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 w-4 text-right shrink-0">{starNum}</span>
                  <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 w-5 text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      {partner.reviews.map((review, idx) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 animate-fade-in-up"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-[14px] font-bold text-white">
                {review.author.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-900">{review.author}</span>
                <span className="text-[11px] text-gray-400">{review.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={
                      i < review.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-[13px] text-gray-600 mt-3 leading-[1.7]">
            {review.content}
          </p>
        </div>
      ))}
    </div>
  );
}
