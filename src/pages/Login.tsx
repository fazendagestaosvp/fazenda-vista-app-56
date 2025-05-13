
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuthContext";

const Login = () => {
  // Estados para o formulário de login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estados para o formulário de registro
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // Estado para mostrar erros de validação
  const [registerError, setRegisterError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const validateRegistration = (): boolean => {
    if (!fullName.trim()) {
      setRegisterError("Nome completo é obrigatório");
      return false;
    }
    
    if (!registerEmail.trim()) {
      setRegisterError("Email é obrigatório");
      return false;
    }
    
    if (registerPassword.length < 6) {
      setRegisterError("A senha deve ter no mínimo 6 caracteres");
      return false;
    }
    
    if (registerPassword !== confirmPassword) {
      setRegisterError("As senhas não conferem");
      return false;
    }
    
    setRegisterError(null);
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegistration()) {
      return;
    }
    
    await signUp(registerEmail, registerPassword, fullName);
    
    // Limpar os campos após o registro
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
    setFullName("");
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
                <Button 
                  type="submit" 
                  className="w-full bg-farm hover:bg-farm-dark"
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {registerError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                    {registerError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome completo</Label>
                  <Input 
                    id="register-name" 
                    placeholder="João Silva" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="••••••" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmar senha</Label>
                  <Input 
                    id="register-confirm" 
                    type="password" 
                    placeholder="••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-farm hover:bg-farm-dark"
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Criar uma conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
