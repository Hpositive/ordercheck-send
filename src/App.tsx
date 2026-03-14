import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import MainPage from './pages/main/MainPage';
import CategoryPage from './pages/category/CategoryPage';
import PartnerListPage from './pages/partner/PartnerListPage';
import PartnerDetailPage from './pages/partner/PartnerDetailPage';
import OrderListPage from './pages/order/OrderListPage';
import OrderDetailPage from './pages/order/OrderDetailPage';
import OrderCreatePage from './pages/order/OrderCreatePage';
import MyPage from './pages/mypage/MyPage';
import LoginPage from './pages/auth/LoginPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen pb-14">
      <Routes>
        <Route path="/" element={<Navigate to="/mobile/main" replace />} />
        <Route path="/mobile/main" element={<MainPage />} />
        <Route path="/mobile/category" element={<CategoryPage />} />
        <Route path="/mobile/category/:categoryId" element={<PartnerListPage />} />
        <Route path="/mobile/partner/:partnerId" element={<PartnerDetailPage />} />
        <Route path="/mobile/orders" element={<OrderListPage />} />
        <Route path="/mobile/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/mobile/order/create/:partnerId" element={<OrderCreatePage />} />
        <Route path="/mobile/mypage" element={<MyPage />} />
        <Route path="/mobile/login" element={<LoginPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
