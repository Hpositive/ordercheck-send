import { categories, partners, orders, currentUser } from './mockData';
import type { Category, Partner, Order, User, OrderItem } from '../types';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Base URL for future real API connection
const BASE_URL = import.meta.env.VITE_API_URL || '';

const USE_MOCK = !BASE_URL;

// ---- Categories ----
export async function fetchCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    await delay();
    return categories;
  }
  const res = await fetch(`${BASE_URL}/api/categories`);
  return res.json();
}

// ---- Partners ----
export async function fetchPartners(categoryId?: string): Promise<Partner[]> {
  if (USE_MOCK) {
    await delay();
    if (categoryId) return partners.filter(p => p.categoryId === categoryId);
    return partners;
  }
  const url = categoryId
    ? `${BASE_URL}/api/partners?categoryId=${categoryId}`
    : `${BASE_URL}/api/partners`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchPartner(id: string): Promise<Partner | undefined> {
  if (USE_MOCK) {
    await delay();
    return partners.find(p => p.id === id);
  }
  const res = await fetch(`${BASE_URL}/api/partners/${id}`);
  return res.json();
}

// ---- Orders ----
export async function fetchOrders(): Promise<Order[]> {
  if (USE_MOCK) {
    await delay();
    return orders;
  }
  const res = await fetch(`${BASE_URL}/api/orders`);
  return res.json();
}

export async function fetchOrder(id: string): Promise<Order | undefined> {
  if (USE_MOCK) {
    await delay();
    return orders.find(o => o.id === id);
  }
  const res = await fetch(`${BASE_URL}/api/orders/${id}`);
  return res.json();
}

export async function createOrder(data: {
  partnerId: string;
  partnerName: string;
  categoryName: string;
  siteName: string;
  siteAddress: string;
  items: OrderItem[];
  memo: string;
}): Promise<Order> {
  if (USE_MOCK) {
    await delay(500);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      ...data,
      status: 'pending',
      totalPrice: data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    orders.push(newOrder);
    return newOrder;
  }
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---- User ----
export async function fetchCurrentUser(): Promise<User> {
  if (USE_MOCK) {
    await delay();
    return currentUser;
  }
  const res = await fetch(`${BASE_URL}/api/user/me`);
  return res.json();
}

export async function login(_email: string, _password: string): Promise<{ token: string; user: User }> {
  if (USE_MOCK) {
    await delay(500);
    return { token: 'mock-jwt-token', user: currentUser };
  }
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: _email, password: _password }),
  });
  return res.json();
}
