
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { PortfolioItem, PricingPack } from './types';
import { Logo, PORTFOLIO_ITEMS, PRICING_PACKS } from './constants';
import { useAppContext } from './contexts';

// --- Layout Components ---

export const Header: React.FC = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      isActive ? 'text-brand-yellow' : 'text-brand-light hover:text-brand-yellow'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 bg-brand-dark bg-opacity-80 backdrop-blur-sm z-50 border-b border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/"><Logo /></Link>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkClass}>Accueil</NavLink>
            <NavLink to="/portfolio" className={navLinkClass}>Portfolio</NavLink>
            <NavLink to="/pricing" className={navLinkClass}>Packs & Tarifs</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-brand-light hover:text-brand-yellow transition-colors">Tableau de bord</Link>
                <button onClick={handleLogout} className="bg-brand-red hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-brand-yellow hover:bg-opacity-80 text-brand-dark font-bold py-2 px-4 rounded-lg transition-all duration-300">
                Espace Client
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-black border-t border-gray-800">
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} Thumbify. Tous droits réservés.</p>
      <div className="flex justify-center space-x-4 mt-4">
        <a href="#" className="hover:text-brand-yellow">Politique de Confidentialité</a>
        <a href="#" className="hover:text-brand-yellow">Conditions d'Utilisation</a>
      </div>
    </div>
  </footer>
);


// --- Page Specific Components ---

export const PortfolioGrid: React.FC<{ items: PortfolioItem[] }> = ({ items }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => <PortfolioCard key={item.id} item={item} />)}
    </div>
);


export const PortfolioCard: React.FC<{ item: PortfolioItem }> = ({ item }) => (
    <div className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-900">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-end p-4">
            <h3 className="text-white text-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
        </div>
    </div>
);


export const PricingCard: React.FC<{ pack: PricingPack }> = ({ pack }) => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    
    const handleOrder = () => {
        if (user) {
            navigate(`/order/${pack.id}`);
        } else {
            navigate('/login');
        }
    }

    return (
        <div className={`border-2 ${pack.isPremium ? 'border-brand-yellow' : 'border-gray-800'} bg-gray-900 p-8 rounded-xl flex flex-col h-full`}>
            {pack.isPremium && <div className="text-center mb-4"><span className="bg-brand-yellow text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase">Premium</span></div>}
            <h3 className="text-2xl font-bold text-center text-white">{pack.title}</h3>
            <p className="text-4xl font-black text-center my-4 text-brand-yellow">€{pack.price}<span className="text-lg font-medium text-gray-400">{pack.isPremium ? '/mois' : ''}</span></p>
            <p className="text-gray-400 text-center min-h-[40px]">{pack.description}</p>
            <ul className="my-8 space-y-4">
                {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg className="w-6 h-6 text-brand-yellow mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-auto">
                <button onClick={handleOrder} className={`w-full font-bold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105 ${pack.isPremium ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-red text-white'}`}>
                    {pack.isPremium ? "S'abonner" : 'Commander'}
                </button>
            </div>
        </div>
    );
};
