import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuthContext";
<<<<<<< HEAD
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

=======
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
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
<<<<<<< HEAD
  
  // Estados para o diálogo de redefinição de senha
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const { toast } = useToast();

=======
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    loading
  } = useAuth();
  const {
    toast
  } = useToast();
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      console.log("Tentando login com:", email);
      await signIn(email, password,
      // Função de sucesso
      () => {
        console.log("Login bem-sucedido, redirecionando para dashboard");
        navigate('/dashboard');
      },
      // Função de erro
      (errorMessage: string) => {
        console.error("Erro ao fazer login:", errorMessage);
        setLoginError(errorMessage);
      });
    } catch (error: any) {
      console.error("Erro capturado no componente Login:", error);
      setLoginError(error.message || "Ocorreu um erro durante o login");
    }
  };
<<<<<<< HEAD
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email para redefinir a senha.",
        variant: "destructive"
      });
      return;
    }
    
    setIsResetting(true);
    
    try {
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
        setIsResetDialogOpen(false);
        setResetEmail("");
      }
    } finally {
      setIsResetting(false);
    }
  };

=======
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
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
    try {
      await signUp(registerEmail, registerPassword, fullName);

      // Limpar os campos após o registro
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
      setFullName("");

      // Mudar para a aba de login automaticamente
      const loginTab = document.querySelector('[data-state="inactive"][value="login"]');
      if (loginTab instanceof HTMLButtonElement) {
        loginTab.click();
      }
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Por favor, faça login com suas novas credenciais"
      });
    } catch (error: any) {
      setRegisterError(error.message || "Ocorreu um erro durante o cadastro");
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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
          <p className="text-gray-500 text-center mb-6">Faça login ou crie uma conta para continuar </p>

          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{loginError}</span>
                  </div>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
<<<<<<< HEAD
                    <button 
                      type="button"
                      onClick={() => setIsResetDialogOpen(true)}
                      className="text-sm text-farm hover:underline"
                    >
=======
                    <a href="#" className="text-sm text-farm hover:underline">
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
                      Esqueceu a senha?
                    </button>
                  </div>
                  <Input id="password" type="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked === true)} />
                  <label htmlFor="remember-me" className="text-sm text-gray-500 cursor-pointer">
                    Lembrar-me
                  </label>
                </div>
                <Button type="submit" className="w-full bg-farm hover:bg-farm-dark" disabled={loading}>
                  {loading ? "Processando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {registerError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{registerError}</span>
                  </div>}
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome completo</Label>
                  <Input id="register-name" placeholder="João Silva" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="seu@email.com" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input id="register-password" type="password" placeholder="••••••" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmar senha</Label>
                  <Input id="register-confirm" type="password" placeholder="••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-farm hover:bg-farm-dark" disabled={loading}>
                  {loading ? "Processando..." : "Criar uma conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Primeiro acesso? Clique na aba "Cadastrar" para criar uma conta.</p>
          </div>
        </CardContent>
      </Card>
<<<<<<< HEAD

      {/* Diálogo de Redefinição de Senha */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              Informe seu email para receber um link de redefinição de senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reset-email" className="col-span-4">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="col-span-4"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
                disabled={isResetting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isResetting}>
                {isResetting ? "Enviando..." : "Enviar link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
=======
    </div>;
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
};
export default Login;