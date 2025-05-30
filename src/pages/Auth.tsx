
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hospital } from "lucide-react";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("secretary");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useSupabaseAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(email, password, name, role);
      toast.success("Compte créé avec succès ! Vérifiez votre email.");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du compte");
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
      <div className="fixed top-4 right-4 flex space-x-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-800 dark:text-white">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Hospital className="h-14 w-14 text-blue-600 bg-inherit rounded-none" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-400">MedArch</CardTitle>
          <CardDescription className="text-inherit text-sm font-light dark:text-gray-300">
            Système d'archivage des dossiers médicaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full dark:bg-gray-700 dark:border-gray-600" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full dark:bg-gray-700 dark:border-gray-600" 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-name" className="text-sm font-medium">
                    Nom complet
                  </label>
                  <Input 
                    id="signup-name" 
                    type="text" 
                    placeholder="Votre nom complet" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full dark:bg-gray-700 dark:border-gray-600" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-role" className="text-sm font-medium">
                    Rôle
                  </label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Sélectionnez votre rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="secretary">Secrétaire</SelectItem>
                      <SelectItem value="nurse">Infirmier(ère)</SelectItem>
                      <SelectItem value="lab">Laboratoire</SelectItem>
                      <SelectItem value="doctor">Médecin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full dark:bg-gray-700 dark:border-gray-600" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full dark:bg-gray-700 dark:border-gray-600" 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-base font-medium"
                >
                  {isLoading ? "Création..." : "Créer un compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          © {currentYear} MedArch - Tous droits réservés
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
