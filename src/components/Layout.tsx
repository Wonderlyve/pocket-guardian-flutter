
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-wallet-primary to-wallet-secondary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={toggleMenu} className="p-1 text-white hover:bg-white/20">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <h1 className="text-xl font-bold">Pocket Guardian</h1>
            {currentUser && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {isAdmin ? 'Admin' : 'Agent'}
              </span>
            )}
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">{currentUser.name}</span>
              <Button 
                variant="outline" 
                className="bg-transparent hover:bg-white/20 border-white text-white hover:text-white"
                onClick={() => logout()}
              >
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Slide-in menu */}
      <div className={`fixed inset-y-0 left-0 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}>
        <div className="py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-wallet-primary">Menu</h2>
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                  onClick={() => {navigate('/'); setMenuOpen(false);}}
                >
                  Tableau de bord
                </Button>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                      onClick={() => {navigate('/wallets'); setMenuOpen(false);}}
                    >
                      Portefeuilles
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                      onClick={() => {navigate('/settings'); setMenuOpen(false);}}
                    >
                      Paramètres
                    </Button>
                  </li>
                </>
              )}
              {!isAdmin && currentUser && (
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-wallet-text hover:text-wallet-primary hover:bg-wallet-light/30"
                    onClick={() => {navigate('/expenses'); setMenuOpen(false);}}
                  >
                    Dépenses
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

      <footer className="bg-wallet-text text-white p-4">
        <div className="container mx-auto text-center">
          <p>© 2025 Pocket Guardian - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
