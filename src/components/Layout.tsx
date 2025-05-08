
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Wallet, Settings, Bell, LogOut, 
  ArrowUpCircle, CreditCard, BarChart, Activity 
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

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-wallet-primary to-wallet-secondary text-white py-3 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Pocket Guardian</h1>
          <div className="flex items-center gap-2">
            {currentUser && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs hidden md:inline">
                {isAdmin ? 'Admin' : 'Agent'}
              </span>
            )}
            <Button variant="ghost" onClick={toggleMenu} className="p-1 text-white hover:bg-white/20">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Right side slide-in menu */}
      <div className={`fixed inset-y-0 right-0 transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}>
        <div className="py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-wallet-primary">Menu</h2>
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {currentUser && (
            <div className="mb-8 p-4 bg-wallet-light/30 rounded-lg">
              <p className="text-wallet-primary font-medium">{currentUser.name}</p>
              <p className="text-xs text-wallet-text/70">{isAdmin ? 'Administrateur' : 'Agent'}</p>
            </div>
          )}
          
          <nav>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant={isActive('/') ? "secondary" : "ghost"}
                  className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                  onClick={() => {navigate('/'); setMenuOpen(false);}}
                >
                  <Home className="h-4 w-4 mr-3" />
                  Tableau de bord
                </Button>
              </li>
              
              <li>
                <Button 
                  variant={isActive('/wallets') ? "secondary" : "ghost"}
                  className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                  onClick={() => {navigate('/wallets'); setMenuOpen(false);}}
                >
                  <Wallet className="h-4 w-4 mr-3" />
                  Portefeuilles
                </Button>
              </li>
              
              {!isAdmin && currentUser && (
                <>
                  <li>
                    <Button 
                      variant={isActive('/expenses') ? "secondary" : "ghost"}
                      className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                      onClick={() => {navigate('/expenses'); setMenuOpen(false);}}
                    >
                      <CreditCard className="h-4 w-4 mr-3" />
                      Dépenses
                    </Button>
                  </li>
                  
                  <li>
                    <Button 
                      variant={isActive('/encaissements') ? "secondary" : "ghost"}
                      className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                      onClick={() => {
                        // Si l'agent a un portefeuille, naviguer vers sa page d'encaissements
                        if (currentUser) {
                          navigate(`/encaissements/${currentUser.id}`); 
                        }
                        setMenuOpen(false);
                      }}
                    >
                      <ArrowUpCircle className="h-4 w-4 mr-3" />
                      Encaissements
                    </Button>
                  </li>
                </>
              )}
              
              {isAdmin && (
                <li>
                  <Button 
                    variant={isActive('/settings') ? "secondary" : "ghost"}
                    className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                    onClick={() => {navigate('/settings'); setMenuOpen(false);}}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Paramètres
                  </Button>
                </li>
              )}
              
              <li className="pt-8">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-wallet-danger hover:text-wallet-danger hover:bg-wallet-light/30"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Déconnexion
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}

      <main className="flex-grow container mx-auto p-4 pb-20 animate-fade-in">
        {children}
      </main>

      {/* Redesigned Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg z-40">
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-around">
            <NavItem 
              icon={<Home className="h-5 w-5" />} 
              label="Accueil" 
              onClick={() => navigate('/')}
              isActive={isActive('/')}
            />
            
            <NavItem 
              icon={<Wallet className="h-5 w-5" />} 
              label="Portefeuilles" 
              onClick={() => navigate('/wallets')}
              isActive={isActive('/wallets')}
            />
            
            <NavItem 
              icon={<Activity className="h-5 w-5" />} 
              label="Opérations" 
              onClick={() => {
                // Si l'emplacement actuel est un portefeuille spécifique, naviguer vers ses opérations
                const walletIdMatch = location.pathname.match(/\/wallets\/([^\/]+)/);
                if (walletIdMatch) {
                  navigate(`/operations/${walletIdMatch[1]}`);
                } else {
                  // Sinon, retour à la liste des portefeuilles
                  navigate('/wallets');
                }
              }}
              isActive={isActive('/operations')}
            />
            
            <NavItem 
              icon={<ArrowUpCircle className="h-5 w-5" />} 
              label="Encaisser" 
              onClick={() => {
                const walletIdMatch = location.pathname.match(/\/wallets\/([^\/]+)/);
                if (walletIdMatch) {
                  navigate(`/encaissements/${walletIdMatch[1]}`);
                } else if (!isAdmin && currentUser) {
                  navigate(`/encaissements/${currentUser.id}`);
                } else {
                  navigate('/wallets');
                }
              }}
              isActive={isActive('/encaissements')}
            />
            
            {isAdmin ? (
              <NavItem 
                icon={<Settings className="h-5 w-5" />} 
                label="Réglages" 
                onClick={() => navigate('/settings')}
                isActive={isActive('/settings')}
              />
            ) : (
              <NavItem 
                icon={<CreditCard className="h-5 w-5" />} 
                label="Dépenser" 
                onClick={() => navigate('/expenses')}
                isActive={isActive('/expenses')}
              />
            )}
          </div>
        </div>
      </div>

      <footer className="bg-wallet-text text-white p-3 text-center text-sm hidden">
        <p>© 2025 Pocket Guardian - Tous droits réservés</p>
      </footer>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center py-3 px-2 transition-colors",
        isActive
          ? "text-wallet-primary"
          : "text-gray-600 hover:text-wallet-primary"
      )}
    >
      <div className={cn(
        "mb-1 p-2 rounded-full transition-colors",
        isActive && "bg-wallet-light/30"
      )}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};
