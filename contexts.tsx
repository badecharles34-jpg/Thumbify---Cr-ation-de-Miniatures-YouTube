
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { User, Order, PricingPack, OrderBrief } from './types';

interface AppContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, role: 'client' | 'admin') => void;
  logout: () => void;
  addOrder: (pack: PricingPack, brief: OrderBrief) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = useCallback((email: string, role: 'client' | 'admin') => {
    setUser({ email, role });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addOrder = useCallback((pack: PricingPack, brief: OrderBrief) => {
    if (!user) {
        console.error("L'utilisateur doit être connecté pour passer une commande.");
        alert("Veuillez vous connecter pour passer une commande.");
        return;
    }
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      pack,
      brief,
      userEmail: user.email,
      status: 'En attente',
      orderDate: new Date(),
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  }, [user]);

  return (
    <AppContext.Provider value={{ user, orders, login, logout, addOrder }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
