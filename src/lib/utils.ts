
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fonction pour sauvegarder l'URL précédente avant une navigation spécifique
export function saveReturnPath(path: string) {
  sessionStorage.setItem('returnPath', path);
}

// Fonction pour récupérer l'URL de retour enregistrée
export function getReturnPath(defaultPath: string = '/dashboard') {
  const savedPath = sessionStorage.getItem('returnPath');
  return savedPath || defaultPath;
}

// Fonction pour naviguer tout en gérant le chemin de retour
export function navigateWithReturn(navigate: Function, to: string, returnTo?: string) {
  if (returnTo) {
    saveReturnPath(returnTo);
  }
  navigate(to);
}
