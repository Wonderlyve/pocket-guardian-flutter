
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-wallet-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Pocket Guardian</h1>
            {currentUser && (
              <span className="bg-wallet-secondary px-2 py-1 rounded-full text-xs">
                {isAdmin ? 'Admin' : 'Agent'}
              </span>
            )}
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span>{currentUser.name}</span>
              <Button 
                variant="outline" 
                className="bg-transparent hover:bg-wallet-secondary border-white text-white hover:text-white"
                onClick={() => logout()}
              >
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </header>

      <nav className="bg-wallet-secondary text-white">
        <div className="container mx-auto py-2">
          <ul className="flex space-x-6">
            <li>
              <button 
                onClick={() => navigate('/')}
                className="px-2 py-1 hover:underline"
              >
                Tableau de bord
              </button>
            </li>
            {isAdmin && (
              <>
                <li>
                  <button 
                    onClick={() => navigate('/wallets')}
                    className="px-2 py-1 hover:underline"
                  >
                    Portefeuilles
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="px-2 py-1 hover:underline"
                  >
                    Paramètres
                  </button>
                </li>
              </>
            )}
            {!isAdmin && currentUser && (
              <li>
                <button 
                  onClick={() => navigate('/expenses')}
                  className="px-2 py-1 hover:underline"
                >
                  Dépenses
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

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
