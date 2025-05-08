
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/wallet';
import { toast } from '@/components/ui/use-toast';

// Simulation de l'authentification (à remplacer par une vraie API)
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password'
  },
  {
    id: '2',
    name: 'Agent One',
    email: 'agent1@example.com',
    role: 'agent',
    password: 'password'
  },
  {
    id: '3',
    name: 'Agent Two',
    email: 'agent2@example.com',
    role: 'agent',
    password: 'password'
  },
];

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Vérifier si un utilisateur est stocké dans le localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // First check regular admin/agent users
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && (user.password === password || password === 'password')) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    // If not found, check in localStorage for wallet agents
    const walletsString = localStorage.getItem('wallets');
    if (walletsString) {
      try {
        const wallets = JSON.parse(walletsString);
        const walletForEmail = wallets.find(
          (w: any) => w.email && w.email.toLowerCase() === email.toLowerCase()
        );
        
        if (walletForEmail && walletForEmail.password === password) {
          // Create a user based on the wallet
          const walletUser: User = {
            id: walletForEmail.agentId,
            name: `Agent (${walletForEmail.name})`,
            email: walletForEmail.email,
            role: 'agent',
            password: walletForEmail.password
          };
          
          setCurrentUser(walletUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(walletUser));
          
          toast({
            title: "Connecté",
            description: `Bienvenue ${walletUser.name}!`,
          });
          
          return true;
        }
      } catch (error) {
        console.error('Error parsing wallets:', error);
      }
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = currentUser?.role === 'admin';

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
