import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, User, Tag, FileText, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchOrder } from '../../api';
import type { Order, OrderStatus } from '../../types';

const PROGRESS_STEPS = [
  { key: 'pending' as const, label: '접수' },
  { key: 'confirmed' as const, label: '확인' },
  { key: 'in_progress' as const, label: '시공중' },
  { key: 'completed' as const, label: '완료' },
];

function getStepIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  const idx = PROGRESS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!orderId) return;
        const data = await fetchOrder(orderId);
        if (data) setOrder(data);
      } catch (e) {
        console.error('Failed to load order', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="주문 상세" showBack />
        <Loading />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="주문 상세" showBack />
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          주문을 찾을 수 없습니다
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
      <Header title="주문 상세" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Status Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {isCancelled ? (
            <div className="text-center py-2">
              <span className="inline-block bg-red-100 text-red-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                주문 취소됨
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {PROGRESS_STEPS.map((step, idx) => {
                const isActive = idx <= currentStep;
                const isLast = idx === PROGRESS_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1.5 font-medium ${
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 mx-1.5 mt-[-14px] ${
                          idx < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 mb-1">주문 정보</h3>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">현장명</p>
              <p className="text-sm font-medium text-gray-900">{order.siteName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">현장주소</p>
              <p className="text-sm font-medium text-gray-900">{order.siteAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">시공사</p>
              <p className="text-sm font-medium text-gray-900">{order.partnerName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Tag size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">시공 분류</p>
              <p className="text-sm font-medium text-gray-900">{order.categoryName}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">시공 항목</h3>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left py-2 px-3 font-medium">항목</th>
                  <th className="text-center py-2 px-2 font-medium">수량</th>
                  <th className="text-center py-2 px-2 font-medium">단위</th>
                  <th className="text-right py-2 px-2 font-medium">단가</th>
                  <th className="text-right py-2 px-3 font-medium">소계</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-50">
                    <td className="py-2.5 px-3 text-gray-900 font-medium">{item.name}</td>
                    <td className="py-2.5 px-2 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-2.5 px-2 text-center text-gray-500">{item.unit}</td>
                    <td className="py-2.5 px-2 text-right text-gray-700">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-900 font-medium">
                      {(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <span className="text-sm font-bold text-gray-900">합계</span>
            <span className="text-lg font-bold text-blue-600">
              {order.totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Memo */}
        {order.memo && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900">메모</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {order.memo}
            </p>
          </div>
        )}

        {/* Date Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">일정 정보</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">주문일</span>
              <span className="text-gray-900 font-medium">{order.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">최종수정일</span>
              <span className="text-gray-900 font-medium">{order.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
