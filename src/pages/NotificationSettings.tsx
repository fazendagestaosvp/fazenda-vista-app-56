
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    reminders: true,
    healthAlerts: true,
    productionReports: false,
    systemUpdates: true,
  });

  const handleToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof notificationSettings]
    }));
  };

  const handleSave = () => {
    // Simulate saving notification settings
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas.",
    });
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
              checked={notificationSettings.email}
              onCheckedChange={() => handleToggle("email")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Lembretes</Label>
              <p className="text-sm text-muted-foreground">Lembretes sobre tarefas e eventos.</p>
            </div>
            <Switch
              id="reminders"
              checked={notificationSettings.reminders}
              onCheckedChange={() => handleToggle("reminders")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="health-alerts">Alertas de Saúde</Label>
              <p className="text-sm text-muted-foreground">Alertas sobre a saúde dos animais.</p>
            </div>
            <Switch
              id="health-alerts"
              checked={notificationSettings.healthAlerts}
              onCheckedChange={() => handleToggle("healthAlerts")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="production-reports">Relatórios de Produção</Label>
              <p className="text-sm text-muted-foreground">Relatórios periódicos sobre produção.</p>
            </div>
            <Switch
              id="production-reports"
              checked={notificationSettings.productionReports}
              onCheckedChange={() => handleToggle("productionReports")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-updates">Atualizações do Sistema</Label>
              <p className="text-sm text-muted-foreground">Notificações sobre novas funcionalidades.</p>
            </div>
            <Switch
              id="system-updates"
              checked={notificationSettings.systemUpdates}
              onCheckedChange={() => handleToggle("systemUpdates")}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}>Salvar Preferências</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
