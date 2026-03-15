
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Wallet, Settings, LogOut, 
  ArrowUpCircle, Activity, 
  PlusCircle, User, Archive, ArrowRightLeft
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
      {/* Header - Clean & minimal */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">{currentUser?.name || 'Pocket Guardian'}</h1>
              <p className="text-[11px] text-muted-foreground">
                {isAdmin ? 'Administrateur' : 'Agent'}
              </p>
            </div>
          </div>
          <button 
            onClick={toggleMenu} 
            className="p-2 rounded-xl hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>

      {/* Side menu */}
      <div className={cn(
        "fixed inset-y-0 right-0 transform w-72 bg-card shadow-2xl transition-transform duration-300 ease-in-out z-50 overflow-y-auto border-l border-border",
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground">Menu</h2>
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {currentUser && (
            <div className="mb-8 p-4 bg-primary rounded-2xl text-primary-foreground">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-3">
                <User className="h-5 w-5" />
              </div>
              <p className="font-semibold text-sm">{currentUser.name}</p>
              <p className="text-xs opacity-80">{isAdmin ? 'Administrateur' : 'Agent'}</p>
            </div>
          )}
          
          <nav>
            <ul className="space-y-1">
              <MenuLink icon={<Home />} label="Tableau de bord" active={isActive('/')} onClick={() => {navigate('/'); setMenuOpen(false);}} />
              
              {isAdmin ? (
                <>
                  <MenuLink icon={<Wallet />} label="Tous les portefeuilles" active={isActive('/wallets')} onClick={() => {navigate('/wallets'); setMenuOpen(false);}} />
                  <MenuLink icon={<PlusCircle />} label="Créer un portefeuille" active={isActive('/wallets/create')} onClick={() => {navigate('/wallets/create'); setMenuOpen(false);}} />
                  <MenuLink icon={<ArrowRightLeft />} label="Transferts" active={isActive('/transfers')} onClick={() => {navigate('/transfers'); setMenuOpen(false);}} />
                  <MenuLink icon={<Archive />} label="Archivage" active={isActive('/archive')} onClick={() => {navigate('/archive'); setMenuOpen(false);}} />
                  <MenuLink icon={<Settings />} label="Paramètres" active={isActive('/settings')} onClick={() => {navigate('/settings'); setMenuOpen(false);}} />
                </>
              ) : (
                <>
                  <MenuLink icon={<Wallet />} label="Mon portefeuille" active={isActive('/wallets/')} onClick={() => {if (currentUser) navigate(`/wallets/${currentUser.id}`); setMenuOpen(false);}} />
                  <MenuLink icon={<Activity />} label="Opérations" active={isActive('/operations/')} onClick={() => {if (currentUser) navigate(`/operations/${currentUser.id}`); setMenuOpen(false);}} />
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

      <main className="flex-grow container mx-auto p-4 pb-20 animate-fade-in">
        {children}
      </main>

      {/* Bottom Navigation - Standard style */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex items-center justify-around py-1">
          {isAdmin ? (
            <>
              <BottomNavItem icon={<Home />} label="Accueil" active={isActive('/')} onClick={() => navigate('/')} />
              <BottomNavItem icon={<Wallet />} label="Wallets" active={isActive('/wallets') && !isActive('/wallets/create')} onClick={() => navigate('/wallets')} />
              <BottomNavItem icon={<ArrowRightLeft />} label="Transferts" active={isActive('/transfers')} onClick={() => navigate('/transfers')} />
              <BottomNavItem icon={<Archive />} label="Archives" active={isActive('/archive')} onClick={() => navigate('/archive')} />
              <BottomNavItem icon={<Settings />} label="Réglages" active={isActive('/settings')} onClick={() => navigate('/settings')} />
            </>
          ) : (
            <>
              <BottomNavItem icon={<Home />} label="Accueil" active={isActive('/')} onClick={() => navigate('/')} />
              <BottomNavItem icon={<Wallet />} label="Wallet" active={isActive('/wallets/')} onClick={() => { if (currentUser) navigate(`/wallets/${currentUser.id}`); }} />
              <BottomNavItem icon={<Activity />} label="Opérations" active={isActive('/operations/')} onClick={() => { if (currentUser) navigate(`/operations/${currentUser.id}`); }} />
              <BottomNavItem icon={<ArrowUpCircle />} label="Encaisser" active={isActive('/encaissements/')} onClick={() => { if (currentUser) navigate(`/encaissements/${currentUser.id}`); }} />
              <BottomNavItem icon={<Archive />} label="Archives" active={isActive('/archive')} onClick={() => navigate('/archive')} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const MenuLink: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
      )}
    >
      <span className="h-5 w-5">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  </li>
);

const BottomNavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-0.5 py-2 px-2 min-w-[52px] transition-colors",
      active ? "text-primary" : "text-muted-foreground"
    )}
  >
    <span className="h-5 w-5 flex items-center justify-center">{icon}</span>
    <span className="text-[10px] font-medium leading-none">{label}</span>
    {active && <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
  </button>
);
