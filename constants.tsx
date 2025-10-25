
import type { PortfolioItem, PricingPack } from './types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: 1, title: "Miniature de Réaction Surpris", imageUrl: "https://picsum.photos/seed/thumb1/600/400", category: "Gaming" },
  { id: 2, title: "La PLUS GRANDE Pizza du Monde", imageUrl: "https://picsum.photos/seed/thumb2/600/400", category: "Vlog" },
  { id: 3, title: "Comment Coder un Site en 10 Minutes", imageUrl: "https://picsum.photos/seed/thumb3/600/400", category: "Tutoriel" },
  { id: 4, title: "Ma Nouvelle Supercar !", imageUrl: "https://picsum.photos/seed/thumb4/600/400", category: "Vlog" },
  { id: 5, title: "Victoire Épique sur Fortnite", imageUrl: "https://picsum.photos/seed/thumb5/600/400", category: "Gaming" },
  { id: 6, title: "React vs. Vue : Le Duel Ultime", imageUrl: "https://picsum.photos/seed/thumb6/600/400", category: "Tutoriel" },
  { id: 7, title: "Carnet de Voyage : Tokyo", imageUrl: "https://picsum.photos/seed/thumb7/600/400", category: "Vlog" },
  { id: 8, title: "Le Krach Boursier Expliqué", imageUrl: "https://picsum.photos/seed/thumb8/600/400", category: "Finance" },
];

export const PRICING_PACKS: PricingPack[] = [
  {
    id: 'starter',
    title: 'Pack Découverte',
    price: 25,
    description: 'Une seule miniature à fort impact pour bien commencer.',
    features: ['1 Miniature Haute Qualité', 'Livraison en 24h', '2 Révisions', 'Fichier Source Inclus'],
  },
  {
    id: 'creator',
    title: 'Pack Créateur',
    price: 115,
    description: 'Parfait pour les créateurs qui publient régulièrement.',
    features: ['5 Miniatures Haute Qualité', 'Livraison Prioritaire', 'Révisions Illimitées', 'Fichiers Sources Inclus'],
  },
  {
    id: 'pro',
    title: 'Pack Pro',
    price: 250,
    description: 'Le meilleur rapport qualité-prix pour les créateurs et agences.',
    features: ['12 Miniatures Haute Qualité', 'Support VIP', 'Révisions Illimitées', 'Fichiers Sources Inclus'],
  },
  {
    id: 'premium',
    title: 'Abonnement Premium',
    price: 400,
    description: 'La solution ultime pour les chaînes sérieuses qui veulent déléguer.',
    features: ['20 Miniatures/Mois', 'Designer Dédié', 'Appel Stratégique', 'Variantes pour Test A/B'],
    isPremium: true,
  },
];

export const Logo = () => (
    <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#101010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </div>
        <span className="font-black text-2xl text-brand-light tracking-tighter">Thumbify</span>
    </div>
);
