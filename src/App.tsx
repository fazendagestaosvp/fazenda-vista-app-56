
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import GestaoGado from "./pages/GestaoGado";
import GestaoCavalos from "./pages/GestaoCavalos";
import HistoricoSaude from "./pages/HistoricoSaude";
import Animais from "./pages/Animais";
import Reproducao from "./pages/Reproducao";
import Relatorios from "./pages/Relatorios";
import CalendarioPage from "./pages/Calendario";
import DocumentosPage from "./pages/Documentos";
import ConfiguracoesPage from "./pages/Configuracoes";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="gestao-gado" element={<GestaoGado />} />
            <Route path="gestao-cavalos" element={<GestaoCavalos />} />
            <Route path="historico-saude" element={<HistoricoSaude />} />
            <Route path="animais" element={<Animais />} />
            <Route path="reproducao" element={<Reproducao />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="calendario" element={<CalendarioPage />} />
            <Route path="documentos" element={<DocumentosPage />} />
            <Route path="configuracoes" element={<ConfiguracoesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
