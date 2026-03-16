
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
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-[15px] border-primary-foreground/10" />
        <div className="absolute top-40 right-20 w-20 h-20 rounded-full border-[10px] border-primary-foreground/5" />
        <div className="absolute bottom-32 left-1/4 w-48 h-48 rounded-full border-[20px] border-primary-foreground/8" />
        <div className="absolute -bottom-10 right-10 w-36 h-36 rounded-full bg-primary-foreground/5" />
      </div>
      
      <div className="w-full max-w-md relative z-10 px-4">
        <div className="text-center mb-8">
          <img src="/kumpta-logo.png" alt="Kumpta" className="w-20 h-20 rounded-2xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">Kumpta</h1>
          <p className="text-primary-foreground/70">Gérez vos portefeuilles en toute simplicité</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
