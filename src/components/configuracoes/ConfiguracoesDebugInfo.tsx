
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ConfiguracoesDebugInfo() {
  const { userRole, isAdmin, loading, user, refreshUserRole } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshRole = async () => {
    setIsRefreshing(true);
    console.log("🔄 Botão de refresh clicado");
    
    if (refreshUserRole) {
      await refreshUserRole();
    }
    
    setIsRefreshing(false);
  };

  const handleDatabaseCheck = async () => {
    if (!user) {
      console.log("❌ Usuário não encontrado para verificação do DB");
      return;
    }

    console.log("🔍 Verificando dados direto no banco...");
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      console.log("Resultado da consulta direta:");
      console.log("Data:", data);
      console.log("Error:", error);
      
      setDebugInfo({
        userId: user.id,
        email: user.email,
        dbQuery: { data, error },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro na consulta:", error);
      setDebugInfo({
        error: error,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center gap-2">
          🐛 Debug Info - Diagnóstico de Role
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-yellow-700">
          <p><strong>User ID:</strong> {user?.id || 'null'}</p>
          <p><strong>Email:</strong> {user?.email || 'null'}</p>
          <p><strong>Role:</strong> {userRole || 'null'}</p>
          <p><strong>isAdmin():</strong> {isAdmin() ? 'true' : 'false'}</p>
          <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshRole}
            disabled={isRefreshing}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isRefreshing ? "Atualizando..." : "🔄 Refresh Role"}
          </Button>
          
          <Button 
            onClick={handleDatabaseCheck}
            size="sm"
            variant="outline"
          >
            🔍 Verificar DB
          </Button>
        </div>

        {debugInfo && (
          <div className="mt-4 p-3 bg-white rounded border">
            <h4 className="font-semibold text-sm mb-2">Dados do Banco:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
