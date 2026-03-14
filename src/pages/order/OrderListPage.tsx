import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchOrders } from '../../api';
import type { Order, OrderStatus } from '../../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '대기중',
  confirmed: '확인',
  in_progress: '진행중',
  completed: '완료',
  cancelled: '취소',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
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

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="주문내역" />
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
      <Header title="주문내역" />

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {(Object.keys(FILTER_MAP) as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="px-4 pb-6 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={48} strokeWidth={1.2} />
            <p className="mt-3 text-sm">주문 내역이 없습니다</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate(`/mobile/orders/${order.id}`)}
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left active:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-gray-900">{order.partnerName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.categoryName}</p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                <span className="truncate">{order.siteName}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-sm font-bold text-gray-900">
                  {order.totalPrice.toLocaleString()}원
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>{order.createdAt}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
