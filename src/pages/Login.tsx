
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Hospital } from "lucide-react";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const { login } = useSupabaseAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success(t('loginSuccess'));
      navigate("/dashboard");
    } catch (error) {
      toast.error(t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'linkedin_oidc') => {
    setIsSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast.error(`Erreur de connexion ${provider === 'google' ? 'Google' : 'LinkedIn'}: ${error.message}`);
      }
    } catch (error: any) {
      toast.error(`Erreur de connexion ${provider === 'google' ? 'Google' : 'LinkedIn'}: ${error.message}`);
    } finally {
      setIsSocialLoading(null);
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
            {t('appDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('google')}
              disabled={isSocialLoading !== null}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isSocialLoading === 'google' ? "Connexion..." : "Continuer avec Google"}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('linkedin_oidc')}
              disabled={isSocialLoading !== null}
            >
              <svg className="h-5 w-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {isSocialLoading === 'linkedin_oidc' ? "Connexion..." : "Continuer avec LinkedIn"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('email')}
              </label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('emailPlaceholder')} 
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
              disabled={isLoading || isSocialLoading !== null} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
            >
              {isLoading ? t('loggingIn') : t('login')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          © {currentYear} MedArch - {t('allRightsReserved')}
        </CardFooter>
      </Card>
      
      {/* Message d'aide avec comptes de test */}
      <div className="fixed bottom-4 right-4">
        <Card className="p-4 shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:text-white">
          <h3 className="font-medium mb-2">{t('demoAccounts')}:</h3>
          <ul className="text-sm space-y-1">
            <li>admin@medarch.com</li>
            <li>secretary@medarch.com</li>
            <li>nurse@medarch.com</li>
            <li>lab@medarch.com</li>
            <li>doctor@medarch.com</li>
            <li className="font-medium mt-1">{t('password')}: password</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Login;
