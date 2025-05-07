
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WalletsList from "./pages/WalletsList";
import CreateWallet from "./pages/CreateWallet";
import WalletDetail from "./pages/WalletDetail";
import OperationsPage from "./pages/OperationsPage";
import EncaissementsPage from "./pages/EncaissementsPage";
import Settings from "./pages/Settings";
import ExpensesPage from "./pages/ExpensesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant de protection des routes authentifiées
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <WalletProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Routes protégées */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/wallets" element={<ProtectedRoute><WalletsList /></ProtectedRoute>} />
              <Route path="/wallets/create" element={<ProtectedRoute><CreateWallet /></ProtectedRoute>} />
              <Route path="/wallets/:id" element={<ProtectedRoute><WalletDetail /></ProtectedRoute>} />
              <Route path="/operations/:id" element={<ProtectedRoute><OperationsPage /></ProtectedRoute>} />
              <Route path="/encaissements/:id" element={<ProtectedRoute><EncaissementsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
              
              {/* Fallback pour les routes non trouvées */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
