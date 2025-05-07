
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, Wallet, Settings, Bell, LogOut, Banknote } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-wallet-primary to-wallet-secondary text-white p-3 shadow-md">
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
      <div className={`fixed inset-y-0 right-0 transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}>
        <div className="py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-wallet-primary">Menu</h2>
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {currentUser && (
            <div className="mb-6 p-3 bg-wallet-light/30 rounded-lg">
              <p className="text-wallet-primary font-medium">{currentUser.name}</p>
              <p className="text-xs text-wallet-text/70">{isAdmin ? 'Administrateur' : 'Agent'}</p>
            </div>
          )}
          
          <nav>
            <ul className="space-y-1">
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                  onClick={() => {navigate('/'); setMenuOpen(false);}}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Button>
              </li>
              
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                  onClick={() => {navigate('/wallets'); setMenuOpen(false);}}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Portefeuilles
                </Button>
              </li>
              
              {isAdmin && (
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                    onClick={() => {navigate('/settings'); setMenuOpen(false);}}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </li>
              )}
              
              {!isAdmin && currentUser && (
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                    onClick={() => {navigate('/expenses'); setMenuOpen(false);}}
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    Dépenses
                  </Button>
                </li>
              )}
              
              {currentUser && (
                <li className="mt-4 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-wallet-danger hover:text-wallet-danger hover:bg-wallet-light/30"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </li>
              )}
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

      <main className="flex-grow container mx-auto p-4 animate-fade-in">
        {children}
      </main>

      <footer className="bg-wallet-text text-white p-3">
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 Pocket Guardian - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
