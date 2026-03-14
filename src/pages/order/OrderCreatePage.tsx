import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, X, MapPin, Layers, MessageSquare, ArrowRight, Building2 } from 'lucide-react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { fetchPartner, createOrder } from '../../api';
import type { Partner, OrderItem } from '../../types';

const EMPTY_ITEM: OrderItem = { name: '', quantity: 1, unit: '', unitPrice: 0 };

export default function OrderCreatePage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const [siteName, setSiteName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [items, setItems] = useState<OrderItem[]>([{ ...EMPTY_ITEM }]);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    async function load() {
      try {
        if (!partnerId) return;
        const data = await fetchPartner(partnerId);
        if (data) setPartner(data);
      } catch (e) {
        console.error('Failed to load partner', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [partnerId]);

  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setAttempted(true);

    if (!partner || !siteName.trim() || !siteAddress.trim()) return;

    const validItems = items.filter((item) => item.name.trim() && item.quantity > 0);
    if (validItems.length === 0) return;

    setSubmitting(true);
    try {
      const categoryName = partner.description || '';
      await createOrder({
        partnerId: partner.id,
        partnerName: partner.name,
        categoryName,
        siteName: siteName.trim(),
        siteAddress: siteAddress.trim(),
        items: validItems,
        memo: memo.trim(),
      });
      navigate('/mobile/orders');
    } catch (e) {
      console.error('Failed to create order', e);
    } finally {
      setSubmitting(false);
    }
  };

  const isValid =
    siteName.trim() !== '' &&
    siteAddress.trim() !== '' &&
    items.some((item) => item.name.trim() && item.quantity > 0);

  const inputClass = (hasError: boolean) =>
    `w-full bg-gray-50 border rounded-xl px-4 h-12 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white ${
      hasError ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
    }`;

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen">
        <Header title="발주하기" showBack />
        <Loading />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen">
        <Header title="발주하기" showBack />
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Building2 size={28} strokeWidth={1.3} className="text-gray-300" />
          </div>
          <p className="text-[15px] font-semibold text-gray-600">시공사 정보를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-[#f7f8fa] min-h-screen pb-8">
      <Header title="발주하기" showBack />

      <div className="px-5 py-5 space-y-4 animate-fade-in-up">
        {/* Partner Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden shrink-0">
            <img
              src={partner.thumbnail}
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-gray-900 mb-0.5">{partner.name}</p>
            <p className="text-[13px] text-blue-600/70 truncate">{partner.description}</p>
          </div>
        </div>

        {/* Site Info Section */}
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
              <MapPin size={13} className="text-blue-600" />
            </div>
            <h3 className="text-[16px] font-extrabold text-gray-900">현장 정보</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2 ml-1">현장명</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="현장명을 입력하세요"
                className={inputClass(attempted && !siteName.trim())}
              />
              {attempted && !siteName.trim() && (
                <p className="text-[11px] text-red-400 mt-1.5 ml-1">현장명을 입력해주세요</p>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2 ml-1">현장주소</label>
              <input
                type="text"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="현장 주소를 입력하세요"
                className={inputClass(attempted && !siteAddress.trim())}
              />
              {attempted && !siteAddress.trim() && (
                <p className="text-[11px] text-red-400 mt-1.5 ml-1">현장주소를 입력해주세요</p>
              )}
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
              <Layers size={13} className="text-blue-600" />
            </div>
            <h3 className="text-[16px] font-extrabold text-gray-900">시공 항목</h3>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const itemSubtotal = item.quantity * item.unitPrice;
              const hasNameError = attempted && !item.name.trim();

              return (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 relative">
                  {/* Item Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-[12px] font-medium text-gray-400">항목 {idx + 1}</span>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center active:bg-red-100 transition-colors"
                      >
                        <X size={14} className="text-red-400" />
                      </button>
                    )}
                  </div>

                  {/* Item Name - Full Width */}
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    placeholder="항목명을 입력하세요"
                    className={`w-full bg-white border rounded-xl px-4 h-12 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 mb-2.5 ${
                      hasNameError ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />

                  {/* 3-col Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 ml-0.5">수량</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] text-center text-gray-900 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 ml-0.5">단위</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                        placeholder="m2"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] text-center text-gray-900 placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 ml-0.5">단가</label>
                      <input
                        type="number"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(idx, 'unitPrice', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] text-right text-gray-900 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right mt-2.5">
                    <span className="text-[13px] text-gray-400">소계 </span>
                    <span className="text-[14px] font-bold text-gray-800">
                      {itemSubtotal.toLocaleString()}원
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Add Item - Dashed Card */}
            <button
              onClick={addItem}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-gray-400 transition-all duration-200 active:border-blue-300 active:text-blue-500 active:bg-blue-50/30 hover:border-gray-400"
            >
              <Plus size={18} />
              항목 추가
            </button>
          </div>
        </div>

        {/* Memo Section */}
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60 p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
              <MessageSquare size={13} className="text-blue-600" />
            </div>
            <h3 className="text-[16px] font-extrabold text-gray-900">추가 메모</h3>
          </div>

          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="시공 관련 참고사항을 입력하세요"
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white resize-none"
          />
        </div>

        {/* Total Price Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-5 py-5 shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
          <p className="text-[13px] text-blue-200 font-medium mb-1">총 견적금액</p>
          <p className="text-[22px] font-extrabold text-white tracking-tight">
            {totalPrice.toLocaleString()}
            <span className="text-[16px] text-blue-200 font-semibold ml-1">원</span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`w-full h-14 rounded-2xl text-[16px] font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid && !submitting
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-transform'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              발주 요청 중...
            </>
          ) : (
            <>
              발주 요청하기
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
