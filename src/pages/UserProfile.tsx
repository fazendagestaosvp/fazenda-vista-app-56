
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuthContext";
import { useProfile } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateProfile, loading } = useProfile();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        fullName: user.email.split("@")[0] || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateProfile({
      fullName: formData.fullName,
      phone: formData.phone,
      bio: formData.bio,
    });

    if (result.success) {
      // Sucesso já é tratado no hook
    }
  };

  // Obter as iniciais do email para o avatar
  const getInitials = () => {
    const email = user?.email || "";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-farm">Perfil do Usuário</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/configuracoes")}>
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Seu Perfil</CardTitle>
            <CardDescription>Sua foto e informações básicas</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="" alt={formData.fullName} />
              <AvatarFallback className="text-3xl bg-farm text-white">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h3 className="font-medium text-lg">{formData.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <p className="text-sm text-muted-foreground">O email não pode ser alterado.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(99) 99999-9999"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-farm hover:bg-farm-dark"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
