import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="발주하기" showBack />
        <Loading />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
        <Header title="발주하기" showBack />
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          시공사 정보를 찾을 수 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto w-full bg-gray-50 min-h-screen">
      <Header title="발주하기" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Partner Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
            <img
              src={partner.thumbnail}
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{partner.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{partner.description}</p>
          </div>
        </div>

        {/* Site Name */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <label className="block text-xs font-bold text-gray-700 mb-2">현장명</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="현장명을 입력하세요"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Site Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <label className="block text-xs font-bold text-gray-700 mb-2">현장주소</label>
          <input
            type="text"
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
            placeholder="현장 주소를 입력하세요"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-gray-700">시공 항목</label>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 active:text-blue-800"
            >
              <Plus size={14} />
              항목 추가
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-400">항목 {idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-red-400 active:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(idx, 'name', e.target.value)}
                  placeholder="항목명"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">수량</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center text-gray-900 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">단위</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                      placeholder="m2, 개"
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">단가</label>
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(idx, 'unitPrice', Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-right text-gray-900 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  소계: <span className="font-medium text-gray-900">{(item.quantity * item.unitPrice).toLocaleString()}원</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <label className="block text-xs font-bold text-gray-700 mb-2">메모</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="시공 관련 메모를 입력하세요"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Total Price */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">총 금액</span>
            <span className="text-xl font-bold text-blue-600">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-colors ${
            isValid && !submitting
              ? 'bg-blue-600 text-white active:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? '발주 요청 중...' : '발주 요청하기'}
        </button>
      </div>
    </div>
  );
}
