import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, User, Tag, FileText, Calendar, Check, AlertTriangle, ChevronRight } from 'lucide-react';
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
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileText size={28} strokeWidth={1.3} className="text-gray-300" />
          </div>
          <p className="text-[15px] font-semibold text-gray-600">주문을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const isPending = order.status === 'pending';

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen pb-8">
      <Header title="주문 상세" showBack />

      <div className="px-5 py-5 space-y-4 animate-fade-in-up">
        {/* Status Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          {isCancelled ? (
            /* Cancelled Alert */
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-red-700 mb-0.5">주문이 취소되었습니다</p>
                  <p className="text-[13px] text-red-400">취소된 주문은 되돌릴 수 없습니다</p>
                </div>
              </div>
            </div>
          ) : (
            /* Progress Stepper */
            <div className="p-5 pb-6">
              <div className="flex items-start justify-between relative">
                {/* Connecting Line Background */}
                <div className="absolute top-4 left-[calc(12.5%)] right-[calc(12.5%)] h-[3px] bg-gray-100 rounded-full" />
                {/* Active Line */}
                {currentStep > 0 && (
                  <div
                    className="absolute top-4 left-[calc(12.5%)] h-[3px] bg-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStep / (PROGRESS_STEPS.length - 1)) * 75}%`,
                    }}
                  />
                )}

                {PROGRESS_STEPS.map((step, idx) => {
                  const isPassed = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  const isFuture = idx > currentStep;

                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10" style={{ width: '25%' }}>
                      {/* Circle */}
                      <div className="relative">
                        {isPassed && (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
                            <Check size={16} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                        {isCurrent && (
                          <div className="relative">
                            <div className="absolute inset-0 w-8 h-8 rounded-full bg-blue-600/20 animate-ping" />
                            <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            </div>
                          </div>
                        )}
                        {isFuture && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-[12px] font-bold text-gray-300">{idx + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className={`text-[11px] mt-2 font-semibold ${
                          isPassed || isCurrent ? 'text-blue-600' : 'text-gray-300'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80">
          <div className="px-5 pt-5 pb-1">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">주문 정보</h3>
          </div>

          <div className="divide-y divide-gray-50">
            {[
              { icon: MapPin, label: '현장명', value: order.siteName },
              { icon: MapPin, label: '현장주소', value: order.siteAddress },
              { icon: User, label: '시공사', value: order.partnerName },
              { icon: Tag, label: '시공 분류', value: order.categoryName },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3.5 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <row.icon size={15} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">{row.label}</p>
                  <p className="text-[14px] font-medium text-gray-900 truncate">{row.value}</p>
                </div>
                <ChevronRight size={14} className="text-gray-200 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80">
          <div className="px-5 pt-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">시공 항목</h3>
          </div>

          <div className="px-5 space-y-2.5 pb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="bg-gray-50/80 rounded-xl p-3.5">
                <div className="flex items-start justify-between mb-1.5">
                  <p className="text-[14px] font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[14px] font-bold text-gray-900">
                    {(item.quantity * item.unitPrice).toLocaleString()}
                    <span className="text-[12px] text-gray-400 font-medium">원</span>
                  </p>
                </div>
                <p className="text-[12px] text-gray-400">
                  {item.quantity.toLocaleString()}{item.unit} x {item.unitPrice.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>

          {/* Total Card */}
          <div className="mx-5 mb-5">
            <div className="bg-blue-600 rounded-xl px-5 py-4 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-blue-100">합계</span>
              <span className="text-[20px] font-bold text-white tracking-tight">
                {order.totalPrice.toLocaleString()}
                <span className="text-[14px] text-blue-200 font-semibold ml-0.5">원</span>
              </span>
            </div>
          </div>
        </div>

        {/* Memo - Quote Style */}
        {order.memo && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-gray-400" />
              <h3 className="text-[15px] font-bold text-gray-900">메모</h3>
            </div>
            <div className="border-l-[3px] border-blue-400 pl-4 py-1">
              <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                {order.memo}
              </p>
            </div>
          </div>
        )}

        {/* Date Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} className="text-gray-400" />
            <h3 className="text-[15px] font-bold text-gray-900">일정 정보</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-400">주문일</span>
              <span className="text-[14px] text-gray-900 font-medium">{order.createdAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-400">최종수정일</span>
              <span className="text-[14px] text-gray-900 font-medium">{order.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isPending && (
          <div className="pt-2">
            <button
              className="w-full py-3.5 rounded-2xl border-2 border-red-200 text-red-500 text-[15px] font-bold transition-all duration-200 active:bg-red-50 active:border-red-300"
            >
              주문 취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
