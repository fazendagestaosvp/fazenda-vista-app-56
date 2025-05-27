
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/use-settings";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { settings, saveSettings, loading } = useSettings();

  const handleToggle = (setting: keyof typeof settings) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    saveSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">
            Configure como e quando deseja receber notificações.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/configuracoes")}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferências de Notificação</CardTitle>
          <CardDescription>Escolha quais notificações deseja receber.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">Receba atualizações por email.</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email}
              onCheckedChange={() => handleToggle("email")}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Lembretes</Label>
              <p className="text-sm text-muted-foreground">Lembretes sobre tarefas e eventos.</p>
            </div>
            <Switch
              id="reminders"
              checked={settings.reminders}
              onCheckedChange={() => handleToggle("reminders")}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="health-alerts">Alertas de Saúde</Label>
              <p className="text-sm text-muted-foreground">Alertas sobre a saúde dos animais.</p>
            </div>
            <Switch
              id="health-alerts"
              checked={settings.healthAlerts}
              onCheckedChange={() => handleToggle("healthAlerts")}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="production-reports">Relatórios de Produção</Label>
              <p className="text-sm text-muted-foreground">Relatórios periódicos sobre produção.</p>
            </div>
            <Switch
              id="production-reports"
              checked={settings.productionReports}
              onCheckedChange={() => handleToggle("productionReports")}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-updates">Atualizações do Sistema</Label>
              <p className="text-sm text-muted-foreground">Notificações sobre novas funcionalidades.</p>
            </div>
            <Switch
              id="system-updates"
              checked={settings.systemUpdates}
              onCheckedChange={() => handleToggle("systemUpdates")}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
