
export interface PortfolioItem {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

export interface PricingPack {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  isPremium?: boolean;
}

export interface OrderBrief {
  videoTitle: string;
  styleInspiration: string;
  keyElements: string;
  notes: string;
  files: File[];
}

export type OrderStatus = 'En attente' | 'En cours' | 'Terminé';

export interface Order {
    id: string;
    pack: PricingPack;
    brief: OrderBrief;
    userEmail: string;
    status: OrderStatus;
    orderDate: Date;
}

export interface User {
    email: string;
    role: 'client' | 'admin';
}
