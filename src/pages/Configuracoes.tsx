
import { useState } from "react";
import { Save, User, Building, MapPin, Shield, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const ConfiguracoesPage = () => {
  const [fazendaInfo, setFazendaInfo] = useState({
    nome: "Fazenda Três Barras",
    proprietario: "João Silva",
    email: "contato@tresbarras.com.br",
    telefone: "(11) 99999-8888",
    endereco: "Estrada Rural, km 15",
    cidade: "Campinas",
    estado: "SP",
    cep: "13000-000",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFazendaInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Configurações</h1>
        <p className="text-gray-500">Gerencie as configurações da sua fazenda</p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="fazenda">Fazenda</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} />
                Informações do Usuário
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" value="João Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value="joao.silva@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value="(11) 99999-8888" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" value="Proprietário" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2">
                <Save size={16} />
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="fazenda" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={18} />
                Informações da Fazenda
              </CardTitle>
              <CardDescription>
                Atualize as informações da sua propriedade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fazenda-nome">Nome da Fazenda</Label>
                  <Input 
                    id="fazenda-nome" 
                    name="nome" 
                    value={fazendaInfo.nome} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fazenda-proprietario">Proprietário</Label>
                  <Input 
                    id="fazenda-proprietario" 
                    name="proprietario" 
                    value={fazendaInfo.proprietario} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fazenda-email">E-mail de Contato</Label>
                  <Input 
                    id="fazenda-email" 
                    name="email" 
                    type="email" 
                    value={fazendaInfo.email} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fazenda-telefone">Telefone</Label>
                  <Input 
                    id="fazenda-telefone" 
                    name="telefone" 
                    value={fazendaInfo.telefone} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <MapPin size={18} />
                  Endereço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fazenda-endereco">Endereço</Label>
                    <Input 
                      id="fazenda-endereco" 
                      name="endereco" 
                      value={fazendaInfo.endereco} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fazenda-cidade">Cidade</Label>
                    <Input 
                      id="fazenda-cidade" 
                      name="cidade" 
                      value={fazendaInfo.cidade} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fazenda-estado">Estado</Label>
                    <Input 
                      id="fazenda-estado" 
                      name="estado" 
                      value={fazendaInfo.estado} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fazenda-cep">CEP</Label>
                    <Input 
                      id="fazenda-cep" 
                      name="cep" 
                      value={fazendaInfo.cep} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2">
                <Save size={16} />
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={18} />
                Segurança
              </CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-farm hover:bg-farm-dark text-white">
                Alterar Senha
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={18} />
                Notificações
              </CardTitle>
              <CardDescription>
                Gerencie suas preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Saúde Animal</h4>
                    <p className="text-sm text-gray-500">Receba alertas sobre problemas de saúde do rebanho</p>
                  </div>
                  <Switch id="health-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Lembretes de Vacinação</h4>
                    <p className="text-sm text-gray-500">Seja notificado sobre datas de vacinação</p>
                  </div>
                  <Switch id="vaccination-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Nível de Estoque</h4>
                    <p className="text-sm text-gray-500">Receba alertas quando estoques estiverem baixos</p>
                  </div>
                  <Switch id="stock-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Relatórios Mensais</h4>
                    <p className="text-sm text-gray-500">Receba relatórios mensais por e-mail</p>
                  </div>
                  <Switch id="monthly-reports" />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <Globe size={18} />
                  Métodos de Notificação
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">E-mail</h4>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS</h4>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações no Aplicativo</h4>
                    </div>
                    <Switch id="app-notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2">
                <Save size={16} />
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesPage;
