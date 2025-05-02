
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hospital } from "lucide-react";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('email')}
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  {t('password')}
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                  {t('forgotPassword')}
                </a>
              </div>
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
              {isLoading ? "Connexion..." : t('login')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MedArch - Tous droits réservés
        </CardFooter>
      </Card>
      
      {/* Message d'aide avec comptes de test */}
      <div className="fixed bottom-4 right-4">
        <Card className="p-4 shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:text-white">
          <h3 className="font-medium mb-2">{t('demoAccounts')} :</h3>
          <ul className="text-sm space-y-1">
            <li>admin@medarch.com</li>
            <li>secretary@medarch.com</li>
            <li>nurse@medarch.com</li>
            <li>lab@medarch.com</li>
            <li>doctor@medarch.com</li>
            <li className="font-medium mt-1">Mot de passe: password</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Login;
