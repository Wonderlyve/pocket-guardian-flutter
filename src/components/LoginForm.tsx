
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result) {
        toast({ title: 'Connexion réussie', description: 'Bienvenue dans Kumpta' });
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
    <div className="bg-card rounded-3xl p-7 shadow-2xl backdrop-blur-sm border border-border/50">
      <h2 className="text-xl font-bold text-center text-foreground mb-0.5">Bon retour 👋</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">Connectez-vous à votre espace</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-11 h-12 rounded-xl bg-muted/50 border border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Connexion...
            </span>
          ) : (
            'Se connecter'
          )}
        </Button>

        <div className="bg-muted/50 rounded-xl p-3 mt-4">
          <p className="text-xs text-muted-foreground text-center font-medium mb-2">
            Comptes de démonstration
          </p>
          <div className="space-y-1">
            {[
              { email: 'admin@example.com', role: 'Admin' },
              { email: 'agent1@example.com', role: 'Agent' },
              { email: 'agent2@example.com', role: 'Agent' },
            ].map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => { setEmail(account.email); setPassword('password'); }}
                className="w-full flex items-center justify-between text-xs px-3 py-2 rounded-lg hover:bg-accent transition-colors group"
              >
                <span className="text-foreground/70 group-hover:text-foreground transition-colors">{account.email}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {account.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
