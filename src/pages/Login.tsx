
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login bem-sucedido",
      description: "Bem-vindo ao FazendaPlus!",
    });
    navigate("/");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro bem-sucedido",
      description: "Sua conta foi criada com sucesso!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <div className="w-20 h-20 bg-farm-muted rounded-full flex items-center justify-center">
              <span className="farm-logo">FP</span>
            </div>
            <h1 className="farm-logo">FazendaPlus</h1>
            <p className="farm-subtitle">Gestão Premium</p>
          </div>

          <h2 className="text-2xl font-bold text-center text-farm mb-2">
            Bem-vindo à FazendaPlus
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Faça login ou crie uma conta para continuar
          </p>

          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <a 
                      href="#" 
                      className="text-sm text-farm hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked === true)} 
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="text-sm text-gray-500 cursor-pointer"
                  >
                    Lembrar-me
                  </label>
                </div>
                <Button type="submit" className="w-full bg-farm hover:bg-farm-dark">
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome completo</Label>
                  <Input 
                    id="register-name" 
                    placeholder="João Silva" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="••••••" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmar senha</Label>
                  <Input 
                    id="register-confirm" 
                    type="password" 
                    placeholder="••••••" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-farm hover:bg-farm-dark">
                  Criar uma conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Novo por aqui?{" "}
              <a href="#" className="text-farm hover:underline">
                Criar uma conta
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
