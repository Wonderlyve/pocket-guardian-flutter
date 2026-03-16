
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary-foreground/5 blur-3xl animate-pulse-light" />
        <div className="absolute top-1/4 -right-16 w-56 h-56 rounded-full bg-primary-foreground/8 blur-2xl" />
        <div className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl animate-pulse-light" style={{ animationDelay: '1s' }} />
        
        {/* Geometric accents */}
        <div className="absolute top-16 right-12 w-16 h-16 rounded-full border-2 border-primary-foreground/15 animate-fade-in" />
        <div className="absolute top-32 left-8 w-8 h-8 rounded-full bg-primary-foreground/10 animate-fade-in" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-40 right-16 w-12 h-12 rounded-full border-2 border-primary-foreground/10 animate-fade-in" style={{ animationDelay: '0.4s' }} />
        <div className="absolute bottom-20 left-12 w-6 h-6 rounded-full bg-primary-foreground/8" />
      </div>
      
      <div className="w-full max-w-sm relative z-10 px-6 animate-slide-up">
        {/* Logo & branding */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-5">
            <div className="absolute inset-0 rounded-3xl bg-primary-foreground/20 blur-xl scale-110" />
            <img 
              src="/kumpta-logo.png" 
              alt="Kumpta" 
              className="relative w-24 h-24 rounded-3xl mx-auto shadow-lg ring-2 ring-primary-foreground/20" 
            />
          </div>
          <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight mb-1">
            Kumpta
          </h1>
          <p className="text-primary-foreground/60 text-sm font-medium">
            Gestion de portefeuilles simplifiée
          </p>
        </div>

        {/* Login card */}
        <LoginForm />

        {/* Footer */}
        <p className="text-center text-primary-foreground/40 text-xs mt-8">
          © 2026 Kumpta · Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default Login;
