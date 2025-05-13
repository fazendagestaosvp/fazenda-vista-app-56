
import { ArrowDown, ArrowUp, Database, Users, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Dashboard</h1>
        <p className="text-gray-500">Visão geral da sua fazenda</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Gado</p>
                <h3 className="text-4xl font-bold mt-1">25</h3>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>3.5% último mês</span>
                </div>
              </div>
              <div className="stats-icon">
                <Database size={24} className="text-farm" />
              </div>
            </div>
            <Button variant="link" asChild className="mt-2 p-0 text-farm">
              <Link to="/gestao-gado">Ver detalhes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Cavalos</p>
                <h3 className="text-4xl font-bold mt-1">8</h3>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>1.8% último mês</span>
                </div>
              </div>
              <div className="stats-icon">
                <Users size={24} className="text-farm" />
              </div>
            </div>
            <Button variant="link" asChild className="mt-2 p-0 text-farm">
              <Link to="/gestao-cavalos">Ver detalhes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Produção de Leite</p>
                <h3 className="text-4xl font-bold mt-1">580L</h3>
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <ArrowDown size={14} className="mr-1" />
                  <span>2.1% último mês</span>
                </div>
              </div>
              <div className="stats-icon">
                <Activity size={24} className="text-farm" />
              </div>
            </div>
            <Button variant="link" asChild className="mt-2 p-0 text-farm">
              <Link to="/historico-saude">Ver saúde</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-farm">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Vacinação do Rebanho</p>
                  <span className="text-sm text-gray-500">10/05/2025</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Vacinação contra febre aftosa</p>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Manutenção de Cercas</p>
                  <span className="text-sm text-gray-500">15/05/2025</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Área norte da fazenda</p>
              </div>
              <div>
                <div className="flex justify-between">
                  <p className="font-medium">Visita Veterinária</p>
                  <span className="text-sm text-gray-500">20/05/2025</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Exames de rotina</p>
              </div>
            </div>
            <Button variant="link" asChild className="mt-4 p-0 text-farm">
              <Link to="/calendario">Ver calendário</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-farm">Últimas Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Animal Adicionado</p>
                  <span className="text-sm text-gray-500">03/05/2025</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Gado: Identificação #BG-103</p>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Colheita Registrada</p>
                  <span className="text-sm text-gray-500">01/05/2025</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">85 kg de milho</p>
              </div>
              <div>
                <div className="flex justify-between">
                  <p className="font-medium">Pagamento Realizado</p>
                  <span className="text-sm text-gray-500">29/04/2025</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Fornecedor de ração</p>
              </div>
            </div>
            <Button variant="link" asChild className="mt-4 p-0 text-farm">
              <Link to="/relatorios">Ver relatórios</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
