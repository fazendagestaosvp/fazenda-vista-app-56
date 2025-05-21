
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const AdminPromoteEditor = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  if (!isAdmin()) {
    navigate("/dashboard");
    return null;
  }

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, forneça um email válido",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('promote_to_editor', { 
        email: email.trim() 
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Sucesso!",
        description: `O usuário ${email} foi promovido a editor com sucesso!`,
      });
      
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Erro ao promover usuário",
        description: error.message || "Ocorreu um erro ao promover o usuário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Promoção de Editor</CardTitle>
          <CardDescription>
            Promova um usuário existente para o papel de editor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePromote}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email do Usuário</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button 
            onClick={handlePromote} 
            disabled={isLoading}
            className="bg-farm hover:bg-farm-dark"
          >
            {isLoading ? "Processando..." : "Promover a Editor"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPromoteEditor;
