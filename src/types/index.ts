export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface Partner {
  id: string;
  name: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  orderCount: number;
  thumbnail: string;
  description: string;
  priceRange: string;
  location: string;
  portfolio: PortfolioItem[];
  reviews: Review[];
  priceTable: PriceItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface PriceItem {
  id: string;
  item: string;
  unit: string;
  price: number;
}

export interface Order {
  id: string;
  partnerId: string;
  partnerName: string;
  categoryName: string;
  status: OrderStatus;
  siteName: string;
  siteAddress: string;
  items: OrderItem[];
  totalPrice: number;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  profileImage?: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  memo: string;
}
