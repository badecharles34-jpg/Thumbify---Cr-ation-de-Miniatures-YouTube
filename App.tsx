
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts';
import { Header, Footer, PortfolioGrid, PricingCard } from './components';
import { PRICING_PACKS, PORTFOLIO_ITEMS } from './constants';
import { generateThumbnailIdeas } from './services/geminiService';
import type { Order, OrderBrief, PortfolioItem } from './types';


// --- App Wrapper ---
const App: React.FC = () => (
  <AppProvider>
    <HashRouter>
      <MainApp />
    </HashRouter>
  </AppProvider>
);

const MainApp: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/order/:packId" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

// --- Protected Route HOC ---
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- Page Components ---

const HomePage: React.FC = () => (
    <>
        <section className="bg-black text-white py-20 sm:py-32">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Des Miniatures Qui <span className="text-brand-yellow">Génèrent des Clics</span>.</h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">Arrêtez de vous fondre dans la masse. Nous créons des miniatures YouTube à fort impact qui captent l'attention et augmentent vos vues. Livraison rapide, qualité pro.</p>
                <Link to="/pricing" className="bg-brand-yellow text-brand-dark font-bold py-4 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-all duration-300 inline-block">Voir les Packs & Tarifs</Link>
            </div>
        </section>
        <section className="py-20 bg-brand-dark">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Nos Créations Récentes</h2>
                <PortfolioGrid items={PORTFOLIO_ITEMS.slice(0, 6)} />
                 <div className="text-center mt-12">
                    <Link to="/portfolio" className="bg-brand-red text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-all">Voir le Portfolio Complet</Link>
                </div>
            </div>
        </section>
    </>
);

const PortfolioPage: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', ...Array.from(new Set(PORTFOLIO_ITEMS.map(i => i.category)))];
    const filteredItems = filter === 'All' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(item => item.category === filter);

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-black text-center mb-4">Portfolio</h1>
            <p className="text-center text-gray-400 mb-8">Un aperçu des miniatures percutantes que nous avons réalisées.</p>
            <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors ${filter === cat ? 'bg-brand-yellow text-brand-dark' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>{cat === 'All' ? 'Tout' : cat}</button>
                ))}
            </div>
            <PortfolioGrid items={filteredItems} />
        </div>
    );
};

const PricingPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-center mb-4">Packs & Tarifs</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Choisissez le plan parfait pour sublimer votre contenu. Pas de frais cachés, juste des résultats époustouflants.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRICING_PACKS.map(pack => <PricingCard key={pack.id} pack={pack} />)}
        </div>
    </div>
);

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const { login, user } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const role = email.includes('admin') ? 'admin' : 'client';
        login(email, role);
        navigate('/dashboard');
    };

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="container mx-auto px-6 py-24 flex justify-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-gray-900 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-800">
                    <h1 className="text-3xl font-bold text-center mb-6">Connexion Client</h1>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">E-mail</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-800 border-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-yellow" id="email" type="email" placeholder="client@email.com ou admin@email.com" required />
                    </div>
                     <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">Mot de passe</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-800 border-gray-700 text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-yellow" id="password" type="password" placeholder="******************" defaultValue="password" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-brand-yellow hover:bg-opacity-80 text-brand-dark font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full" type="submit">
                            Se connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OrderPage: React.FC = () => {
    const { packId } = useParams<{ packId: string }>();
    const pack = PRICING_PACKS.find(p => p.id === packId);
    const { addOrder } = useAppContext();
    const navigate = useNavigate();
    const [brief, setBrief] = useState<OrderBrief>({ videoTitle: '', styleInspiration: '', keyElements: '', notes: '', files: [] });
    const [ideaTopic, setIdeaTopic] = useState('');
    const [ideas, setIdeas] = useState('');
    const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);


    if (!pack) return <div className="text-center py-20">Pack non trouvé.</div>;

    const handleBriefChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBrief({ ...brief, [e.target.name]: e.target.value });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setBrief({ ...brief, files: Array.from(e.target.files) });
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addOrder(pack, brief);
        navigate('/confirmation');
    }

    const handleGetIdeas = async () => {
        if (!ideaTopic) return;
        setIsLoadingIdeas(true);
        setIdeas('');
        const result = await generateThumbnailIdeas(ideaTopic);
        setIdeas(result);
        setIsLoadingIdeas(false);
    }
    
    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-black mb-2">Brief de Commande</h1>
            <p className="text-xl text-brand-yellow mb-8">Vous avez sélectionné : {pack.title}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <form onSubmit={handleSubmit} className="lg:col-span-2 bg-gray-900 p-8 rounded-lg border border-gray-800 space-y-6">
                    <div>
                        <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-300 mb-1">Titre / Sujet de la vidéo</label>
                        <input type="text" name="videoTitle" id="videoTitle" onChange={handleBriefChange} className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-brand-yellow focus:border-brand-yellow" required />
                    </div>
                     <div>
                        <label htmlFor="styleInspiration" className="block text-sm font-medium text-gray-300 mb-1">Inspiration de style (lien vers d'autres vidéos, chaînes...)</label>
                        <input type="text" name="styleInspiration" id="styleInspiration" onChange={handleBriefChange} className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-brand-yellow focus:border-brand-yellow" />
                    </div>
                    <div>
                        <label htmlFor="keyElements" className="block text-sm font-medium text-gray-300 mb-1">Éléments clés / Texte à inclure</label>
                        <textarea name="keyElements" id="keyElements" rows={3} onChange={handleBriefChange} className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-brand-yellow focus:border-brand-yellow" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes supplémentaires</label>
                        <textarea name="notes" id="notes" rows={3} onChange={handleBriefChange} className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-brand-yellow focus:border-brand-yellow"></textarea>
                    </div>
                    <div>
                         <label htmlFor="files" className="block text-sm font-medium text-gray-300 mb-1">Télécharger des fichiers (images, logos...)</label>
                         <input type="file" name="files" id="files" onChange={handleFileChange} multiple className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-brand-dark hover:file:bg-opacity-80" />
                    </div>
                    <button type="submit" className="w-full bg-brand-red text-white font-bold py-3 rounded-lg text-lg hover:bg-opacity-80 transition-all">Valider la Commande (€{pack.price})</button>
                </form>

                <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 h-fit">
                    <h3 className="text-xl font-bold mb-4 text-brand-yellow">Besoin d'idées ?</h3>
                    <p className="text-gray-400 mb-4 text-sm">Utilisez notre assistant IA pour trouver des concepts pour votre miniature.</p>
                    <input type="text" value={ideaTopic} onChange={e => setIdeaTopic(e.target.value)} placeholder="Le sujet de votre vidéo..." className="w-full bg-gray-800 border-gray-700 rounded-md p-2 mb-4 focus:ring-brand-yellow focus:border-brand-yellow" />
                    <button onClick={handleGetIdeas} disabled={isLoadingIdeas} className="w-full bg-brand-yellow text-brand-dark font-bold py-2 rounded-lg hover:bg-opacity-80 disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {isLoadingIdeas ? 'Génération en cours...' : 'Obtenir des idées'}
                    </button>
                    {ideas && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-md whitespace-pre-wrap text-sm text-gray-200 max-h-96 overflow-y-auto">
                            {ideas}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const DashboardPage: React.FC = () => {
    const { user, orders } = useAppContext();
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);

    const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
        setPortfolioItems(prev => [...prev, { ...item, id: Date.now() }]);
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-black mb-2">Tableau de bord</h1>
            <p className="text-lg text-gray-400 mb-8">Bon retour, {user?.email}</p>

            {user?.role === 'admin' ? (
                <AdminPanel orders={orders} portfolioItems={portfolioItems} onAddItem={addPortfolioItem} />
            ) : (
                <ClientPanel orders={orders.filter(o => o.userEmail === user?.email)} />
            )}
        </div>
    );
};

const ClientPanel: React.FC<{orders: Order[]}> = ({ orders }) => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Vos Commandes</h2>
        {orders.length > 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800"><tr><th className="p-4">ID Commande</th><th className="p-4">Pack</th><th className="p-4">Date</th><th className="p-4">Statut</th></tr></thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-t border-gray-800">
                                <td className="p-4 font-mono text-sm">{order.id}</td>
                                <td className="p-4">{order.pack.title}</td>
                                <td className="p-4">{order.orderDate.toLocaleDateString()}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Terminé' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>{order.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : <p>Vous n'avez pas encore de commandes.</p>}
    </div>
);

const AdminPanel: React.FC<{orders: Order[], portfolioItems: PortfolioItem[], onAddItem: (item: Omit<PortfolioItem, 'id'>) => void }> = ({ orders, portfolioItems, onAddItem }) => {
    const [newItem, setNewItem] = useState({ title: '', imageUrl: '', category: ''});
    
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        onAddItem(newItem);
        setNewItem({ title: '', imageUrl: '', category: ''});
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                 <h2 className="text-2xl font-bold mb-4">Toutes les Commandes</h2>
                 {orders.length > 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800"><tr><th className="p-4">Client</th><th className="p-4">Pack</th><th className="p-4">Statut</th></tr></thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="border-t border-gray-800">
                                        <td className="p-4">{order.userEmail}</td>
                                        <td className="p-4">{order.pack.title}</td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Terminé' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p>Aucune commande pour le moment.</p>}
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Gérer le Portfolio</h2>
                <form onSubmit={handleAddItem} className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-4">
                    <h3 className="font-bold">Ajouter un élément</h3>
                    <input type="text" placeholder="Titre" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-gray-800 p-2 rounded" required />
                    <input type="text" placeholder="URL de l'image" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="w-full bg-gray-800 p-2 rounded" required />
                    <input type="text" placeholder="Catégorie" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-gray-800 p-2 rounded" required />
                    <button type="submit" className="w-full bg-brand-yellow text-brand-dark font-bold py-2 rounded">Ajouter l'élément</button>
                </form>
            </div>
        </div>
    );
};


const ConfirmationPage: React.FC = () => (
    <div className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1 className="text-4xl font-black mt-4">Commande Reçue !</h1>
            <p className="text-gray-300 mt-4">Merci pour votre commande. Nous avons bien reçu votre brief et nous mettons au travail. Vous recevrez une facture PayPal sous peu. Veuillez consulter vos e-mails.</p>
            <Link to="/dashboard" className="mt-8 inline-block bg-brand-yellow text-brand-dark font-bold py-3 px-6 rounded-lg">Aller au Tableau de Bord</Link>
        </div>
    </div>
);

export default App;
