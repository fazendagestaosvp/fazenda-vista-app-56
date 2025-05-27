
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuthContext";

export default function ConfiguracoesDebugInfo() {
  const { userRole, isAdmin, loading } = useAuth();

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-yellow-700">
          Role: {userRole || 'null'} | 
          isAdmin: {isAdmin() ? 'true' : 'false'} | 
          Loading: {loading ? 'true' : 'false'}
        </p>
      </CardContent>
    </Card>
  );
}
