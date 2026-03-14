import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, MapPin, Clock, CheckCircle2, XCircle, Loader2, Search } from 'lucide-react';
import Header from '../../components/Header';
import { SkeletonList } from '../../components/Loading';
import { fetchOrders } from '../../api';
import type { Order, OrderStatus } from '../../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '대기중',
  confirmed: '확인',
  in_progress: '진행중',
  completed: '완료',
  cancelled: '취소',
};

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; icon: typeof Clock }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', icon: CheckCircle2 },
  in_progress: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: Loader2 },
  completed: { bg: 'bg-gray-100', text: 'text-gray-500', icon: CheckCircle2 },
  cancelled: { bg: 'bg-red-50', text: 'text-red-500', icon: XCircle },
};

const CATEGORY_EMOJI: Record<string, string> = {
  '도배': '🎨',
  '타일': '🧱',
  '바닥': '🪵',
  '페인트': '🖌️',
  '전기': '⚡',
  '설비': '🔧',
  '목공': '🪚',
  '철거': '🏗️',
};

const CATEGORY_COLORS: Record<string, string> = {
  '도배': 'bg-purple-50 text-purple-600',
  '타일': 'bg-orange-50 text-orange-600',
  '바닥': 'bg-amber-50 text-amber-700',
  '페인트': 'bg-sky-50 text-sky-600',
  '전기': 'bg-yellow-50 text-yellow-600',
  '설비': 'bg-teal-50 text-teal-600',
  '목공': 'bg-rose-50 text-rose-600',
  '철거': 'bg-stone-100 text-stone-600',
};

type FilterTab = '전체' | '대기중' | '진행중' | '완료' | '취소';

const FILTER_MAP: Record<FilterTab, OrderStatus | null> = {
  '전체': null,
  '대기중': 'pending',
  '진행중': 'in_progress',
  '완료': 'completed',
  '취소': 'cancelled',
};

export default function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('전체');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredOrders = FILTER_MAP[activeTab]
    ? orders.filter((o) => o.status === FILTER_MAP[activeTab])
    : orders;

  const getCategoryEmoji = (name: string) => {
    for (const key of Object.keys(CATEGORY_EMOJI)) {
      if (name.includes(key)) return CATEGORY_EMOJI[key];
    }
    return '📦';
  };

  const getCategoryColor = (name: string) => {
    for (const key of Object.keys(CATEGORY_COLORS)) {
      if (name.includes(key)) return CATEGORY_COLORS[key];
    }
    return 'bg-gray-50 text-gray-600';
  };

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="주문내역" />
        <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-16 rounded-full shrink-0" />
          ))}
        </div>
        <SkeletonList count={4} />
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
      <Header title="주문내역" />

      {/* Filter Pill Bar */}
      <div className="sticky top-[52px] z-30 bg-gray-50/95 backdrop-blur-sm">
        <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-hide">
          {(Object.keys(FILTER_MAP) as FilterTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === '전체'
              ? orders.length
              : orders.filter((o) => o.status === FILTER_MAP[tab]).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 active:bg-gray-50'
                }`}
              >
                {tab}
                {tab === '전체' && (
                  <span
                    className={`text-[11px] min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Order List */}
      <div className="px-5 pb-8">
        {filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <Package size={36} strokeWidth={1.3} className="text-gray-300" />
            </div>
            <p className="text-[17px] font-bold text-gray-800 mb-1.5">주문 내역이 없습니다</p>
            <p className="text-[13px] text-gray-400 mb-6">시공사를 찾아 첫 발주를 해보세요</p>
            <button
              onClick={() => navigate('/mobile/partners')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-[14px] font-bold rounded-xl shadow-sm shadow-blue-600/25 active:bg-blue-700 transition-colors"
            >
              <Search size={16} />
              시공사 찾기
            </button>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {filteredOrders.map((order) => {
              const statusConf = STATUS_CONFIG[order.status];
              const StatusIcon = statusConf.icon;

              return (
                <button
                  key={order.id}
                  onClick={() => navigate(`/mobile/orders/${order.id}`)}
                  className="card-interactive w-full bg-white rounded-2xl p-4 text-left transition-all duration-200"
                >
                  {/* Top Row: Category + Status */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(order.categoryName)}`}>
                      <span className="text-xs">{getCategoryEmoji(order.categoryName)}</span>
                      {order.categoryName}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusConf.bg} ${statusConf.text}`}>
                      <StatusIcon size={12} className={order.status === 'in_progress' ? 'animate-spin' : ''} />
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  {/* Partner Name */}
                  <p className="text-[16px] font-bold text-gray-900 mb-1">{order.partnerName}</p>

                  {/* Site */}
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin size={13} className="text-gray-300 shrink-0" />
                    <p className="text-[13px] text-gray-400 truncate">{order.siteName}</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-3" />

                  {/* Bottom: Price + Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] font-bold text-gray-900">
                      {order.totalPrice.toLocaleString()}
                      <span className="text-[13px] font-semibold text-gray-500">원</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] text-gray-300">{order.createdAt}</span>
                      <ChevronRight size={16} className="text-gray-200" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
