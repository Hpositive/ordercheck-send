import type { Category, Partner, Order, User } from '../types';

export const categories: Category[] = [
  { id: 'demolition', name: '철거', icon: '🔨', description: '인테리어 철거 전문', count: 45 },
  { id: 'wallpaper', name: '도배', icon: '🎨', description: '벽지/도배 시공', count: 62 },
  { id: 'flooring', name: '바닥', icon: '🏠', description: '바닥재 시공', count: 38 },
  { id: 'tile', name: '타일', icon: '🔲', description: '타일 시공', count: 41 },
  { id: 'carpentry', name: '목공', icon: '🪚', description: '목공사 전문', count: 35 },
  { id: 'electrical', name: '전기', icon: '⚡', description: '전기 공사', count: 28 },
  { id: 'plumbing', name: '설비', icon: '🔧', description: '배관/설비 공사', count: 22 },
  { id: 'painting', name: '페인트', icon: '🖌️', description: '페인팅 시공', count: 33 },
  { id: 'window', name: '창호', icon: '🪟', description: '창호/샷시 공사', count: 19 },
  { id: 'furniture', name: '가구', icon: '🪑', description: '붙박이/가구 제작', count: 27 },
  { id: 'aircon', name: '에어컨', icon: '❄️', description: '냉난방 설치', count: 15 },
  { id: 'cleaning', name: '입주청소', icon: '✨', description: '입주 전 청소', count: 20 },
];

const generatePartners = (): Partner[] => {
  const names = [
    '정성시공', '한빛인테리어', '드림하우스', '명품시공', '프로빌드',
    '우리시공', '베스트홈', '탑인테리어', '골드시공', '에이스빌드',
    '미래시공', '그린홈', '블루빌드', '레드라인', '스타시공',
  ];
  const locations = ['서울 강남', '서울 서초', '서울 마포', '경기 성남', '경기 용인', '서울 송파', '서울 강서', '인천 남동'];

  return names.flatMap((name, i) =>
    categories.slice(0, 4).map((cat, j) => ({
      id: `partner-${i}-${j}`,
      name: `${name}`,
      categoryId: cat.id,
      rating: Number((4 + Math.random()).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 100) + 10,
      orderCount: Math.floor(Math.random() * 500) + 50,
      thumbnail: `https://picsum.photos/seed/${i}${j}/200/200`,
      description: `${cat.name} 전문 시공업체입니다. ${Math.floor(Math.random() * 10) + 5}년 경력.`,
      priceRange: `${(Math.floor(Math.random() * 5) + 2) * 10},000원~`,
      location: locations[i % locations.length],
      portfolio: Array.from({ length: 4 }, (_, k) => ({
        id: `portfolio-${i}-${j}-${k}`,
        title: `시공 사례 ${k + 1}`,
        image: `https://picsum.photos/seed/p${i}${j}${k}/400/300`,
        description: `${cat.name} 시공 완료`,
      })),
      reviews: Array.from({ length: 3 }, (_, k) => ({
        id: `review-${i}-${j}-${k}`,
        author: `고객${k + 1}`,
        rating: Number((4 + Math.random()).toFixed(1)),
        content: '시공 깔끔하고 친절하게 잘 해주셨습니다. 추천합니다!',
        date: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      })),
      priceTable: [
        { id: `price-1`, item: `${cat.name} 기본`, unit: '㎡', price: (Math.floor(Math.random() * 5) + 2) * 10000 },
        { id: `price-2`, item: `${cat.name} 프리미엄`, unit: '㎡', price: (Math.floor(Math.random() * 5) + 5) * 10000 },
        { id: `price-3`, item: '출장비', unit: '회', price: 50000 },
      ],
    }))
  );
};

export const partners: Partner[] = generatePartners();

export const orders: Order[] = [
  {
    id: 'order-1',
    partnerId: 'partner-0-0',
    partnerName: '정성시공',
    categoryName: '철거',
    status: 'completed',
    siteName: '강남 래미안 1204호',
    siteAddress: '서울 강남구 테헤란로 123',
    items: [
      { name: '철거 기본', quantity: 30, unit: '㎡', unitPrice: 30000 },
      { name: '폐기물 처리', quantity: 1, unit: '회', unitPrice: 200000 },
    ],
    totalPrice: 1100000,
    memo: '화장실 타일 철거 포함',
    createdAt: '2026-02-15',
    updatedAt: '2026-02-20',
  },
  {
    id: 'order-2',
    partnerId: 'partner-1-1',
    partnerName: '한빛인테리어',
    categoryName: '도배',
    status: 'in_progress',
    siteName: '마포 현대아파트 503호',
    siteAddress: '서울 마포구 월드컵로 456',
    items: [
      { name: '도배 실크', quantity: 45, unit: '㎡', unitPrice: 25000 },
    ],
    totalPrice: 1125000,
    memo: '거실, 방3개',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-05',
  },
  {
    id: 'order-3',
    partnerId: 'partner-2-2',
    partnerName: '드림하우스',
    categoryName: '바닥',
    status: 'pending',
    siteName: '성남 분당 판교 1차',
    siteAddress: '경기 성남시 분당구 판교로 789',
    items: [
      { name: '강마루 시공', quantity: 60, unit: '㎡', unitPrice: 40000 },
    ],
    totalPrice: 2400000,
    memo: '전체 바닥 교체',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10',
  },
];

export const currentUser: User = {
  id: 'user-1',
  name: '홍길동',
  email: 'hong@interior.com',
  company: '홍인테리어',
  phone: '010-1234-5678',
};
