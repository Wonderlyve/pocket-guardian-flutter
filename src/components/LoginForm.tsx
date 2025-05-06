
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue dans l\'application Pocket Guardian',
        });
      } else {
        toast({
          title: 'Erreur de connexion',
          description: 'Email ou mot de passe incorrect',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Une erreur est survenue lors de la connexion',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-wallet-primary font-bold text-center">
          Pocket Guardian
        </CardTitle>
        <CardDescription className="text-center">
          Connectez-vous pour accéder à votre espace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Utilisez "password" comme mot de passe pour les utilisateurs de test:
            </p>
            <ul className="text-xs text-muted-foreground list-disc ml-4">
              <li>admin@example.com (Admin)</li>
              <li>agent1@example.com (Agent)</li>
              <li>agent2@example.com (Agent)</li>
            </ul>
          </div>
          <Button
            type="submit"
            className="w-full bg-wallet-primary hover:bg-wallet-secondary"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Connexion'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
