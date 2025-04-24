
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "@/components/ui/sonner";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hospital } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Hospital className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">MedArch</CardTitle>
          <CardDescription>
            Système d'archivage des dossiers médicaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Adresse e-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  Mot de passe oublié?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MedArch - Tous droits réservés
        </CardFooter>
      </Card>
      
      {/* Message d'aide avec comptes de test */}
      <div className="fixed bottom-4 right-4">
        <Card className="p-4 shadow-md bg-white/80 backdrop-blur-sm">
          <h3 className="font-medium mb-2">Comptes de démonstration :</h3>
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
