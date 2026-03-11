
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Lock, Mail } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result) {
        toast({ title: 'Connexion réussie', description: 'Bienvenue dans Pocket Guardian' });
      } else {
        toast({ title: 'Erreur de connexion', description: 'Email ou mot de passe incorrect', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur de connexion', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-center text-foreground mb-1">Connexion</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">Accédez à votre espace</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-12 rounded-xl bg-accent/50 border-0 focus-visible:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 h-12 rounded-xl bg-accent/50 border-0 focus-visible:ring-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Utilisez "password" comme mot de passe pour les tests:
          </p>
          <ul className="text-xs text-muted-foreground list-disc ml-4 space-y-0.5">
            <li>admin@example.com (Admin)</li>
            <li>agent1@example.com (Agent)</li>
            <li>agent2@example.com (Agent)</li>
          </ul>
        </div>
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-secondary text-primary-foreground font-semibold text-base shadow-md"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
