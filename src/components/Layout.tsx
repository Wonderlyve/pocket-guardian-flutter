
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Wallet, Settings, LogOut, 
  ArrowUpCircle, CreditCard, Activity, 
  PlusCircle, User, Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const handleLogout = () => { logout(); setMenuOpen(false); };
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[20px] border-primary-foreground/20" />
          <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full border-[20px] border-primary-foreground/10" />
        </div>
        <div className="container mx-auto flex justify-between items-center relative z-10">
          <div>
            <p className="text-sm opacity-80">
              {isAdmin ? 'Bonjour!' : 'Bienvenue!'}
            </p>
            <h1 className="text-xl font-bold">{currentUser?.name || 'Pocket Guardian'}</h1>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-xs font-medium">
                {isAdmin ? 'Admin' : 'Agent'}
              </span>
            )}
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Right side slide-in menu */}
      <div className={cn(
        "fixed inset-y-0 right-0 transform w-72 bg-card shadow-2xl transition-transform duration-300 ease-in-out z-50 overflow-y-auto",
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-primary">Menu</h2>
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {currentUser && (
            <div className="mb-8 p-4 bg-primary rounded-2xl text-primary-foreground">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-3">
                <User className="h-6 w-6" />
              </div>
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-sm opacity-80">{isAdmin ? 'Administrateur' : 'Agent'}</p>
              {!isAdmin && currentUser.email && (
                <p className="text-xs opacity-70 mt-1">{currentUser.email}</p>
              )}
            </div>
          )}
          
          <nav>
            <ul className="space-y-1">
              <MenuLink icon={<Home />} label="Tableau de bord" active={isActive('/')} onClick={() => {navigate('/'); setMenuOpen(false);}} />
              
              {isAdmin ? (
                <>
                  <MenuLink icon={<Wallet />} label="Tous les portefeuilles" active={isActive('/wallets')} onClick={() => {navigate('/wallets'); setMenuOpen(false);}} />
                  <MenuLink icon={<PlusCircle />} label="Créer un portefeuille" active={isActive('/wallets/create')} onClick={() => {navigate('/wallets/create'); setMenuOpen(false);}} />
                  <MenuLink icon={<Archive />} label="Archivage" active={isActive('/archive')} onClick={() => {navigate('/archive'); setMenuOpen(false);}} />
                  <MenuLink icon={<Settings />} label="Paramètres" active={isActive('/settings')} onClick={() => {navigate('/settings'); setMenuOpen(false);}} />
                </>
              ) : (
                <>
                  <MenuLink icon={<Wallet />} label="Mon portefeuille" active={isActive('/wallets/')} onClick={() => {if (currentUser) navigate(`/wallets/${currentUser.id}`); setMenuOpen(false);}} />
                  <MenuLink icon={<Activity />} label="Opérations" active={isActive('/operations/')} onClick={() => {if (currentUser) navigate(`/operations/${currentUser.id}`); setMenuOpen(false);}} />
                  <MenuLink icon={<CreditCard />} label="Dépenses" active={isActive('/expenses')} onClick={() => {navigate('/expenses'); setMenuOpen(false);}} />
                  <MenuLink icon={<ArrowUpCircle />} label="Encaissements" active={isActive('/encaissements/')} onClick={() => {if (currentUser) navigate(`/encaissements/${currentUser.id}`); setMenuOpen(false);}} />
                  <MenuLink icon={<Archive />} label="Archivage" active={isActive('/archive')} onClick={() => {navigate('/archive'); setMenuOpen(false);}} />
                </>
              )}
              
              <li className="pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40" onClick={toggleMenu} />
      )}

      <main className="flex-grow container mx-auto p-4 pb-24 animate-fade-in">
        {children}
      </main>

      {/* Bottom Navigation - Modern pill style like reference */}
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-card rounded-2xl shadow-lg border border-border/50 px-2 py-2">
          <div className="flex items-center justify-around">
            {isAdmin ? (
              <>
                <BottomNavItem icon={<Home />} label="Accueil" active={isActive('/')} onClick={() => navigate('/')} />
                <BottomNavItem icon={<Wallet />} label="Portefeuilles" active={isActive('/wallets') && !isActive('/wallets/create')} onClick={() => navigate('/wallets')} />
                <BottomNavItem icon={<PlusCircle />} label="Créer" active={isActive('/wallets/create')} onClick={() => navigate('/wallets/create')} isPrimary />
                <BottomNavItem icon={<Settings />} label="Réglages" active={isActive('/settings')} onClick={() => navigate('/settings')} />
              </>
            ) : (
              <>
                <BottomNavItem icon={<Home />} label="Accueil" active={isActive('/')} onClick={() => navigate('/')} />
                <BottomNavItem icon={<Wallet />} label="Portefeuille" active={isActive('/wallets/')} onClick={() => { if (currentUser) navigate(`/wallets/${currentUser.id}`); }} />
                <BottomNavItem icon={<Activity />} label="Opérations" active={isActive('/operations/')} onClick={() => { if (currentUser) navigate(`/operations/${currentUser.id}`); }} />
                <BottomNavItem icon={<ArrowUpCircle />} label="Encaisser" active={isActive('/encaissements/')} onClick={() => { if (currentUser) navigate(`/encaissements/${currentUser.id}`); }} />
                <BottomNavItem icon={<CreditCard />} label="Dépenses" active={isActive('/expenses')} onClick={() => navigate('/expenses')} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MenuLinkProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const MenuLink: React.FC<MenuLinkProps> = ({ icon, label, active, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent"
      )}
    >
      <span className="h-5 w-5">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  </li>
);

interface BottomNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  isPrimary?: boolean;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({ icon, label, active, onClick, isPrimary }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[56px]",
      isPrimary && !active && "text-primary",
      active
        ? "bg-primary text-primary-foreground shadow-md scale-105"
        : "text-muted-foreground hover:text-primary"
    )}
  >
    <span className="h-5 w-5 flex items-center justify-center">{icon}</span>
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </button>
);
