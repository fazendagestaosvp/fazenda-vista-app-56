import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o usuário chegou aqui através de um link de redefinição de senha
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("type=recovery")) {
      toast({
        title: "Link inválido",
        description: "Este link de redefinição de senha é inválido ou expirou.",
        variant: "destructive"
      });
      
      // Redirecionar para a página de login após um pequeno delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar as senhas
    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Senha redefinida com sucesso",
          description: "Sua senha foi atualizada. Você será redirecionado para a página de login."
        });
        
        // Redirecionar para a página de login após um pequeno delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao redefinir sua senha");
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Ocorreu um erro ao redefinir sua senha",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Redefinir Senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
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
              {loading ? "Processando..." : "Redefinir Senha"}
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
                className="text-farm"
              >
                Voltar para o login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
