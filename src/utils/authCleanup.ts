
export const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  
  // Clear all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
      console.log('Removed localStorage key:', key);
    }
  });
  
  // Clear from sessionStorage as well
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
        console.log('Removed sessionStorage key:', key);
      }
    });
  }
  
  // Clear any other auth-related storage
  localStorage.removeItem('supabase.auth.token');
  sessionStorage.removeItem('supabase.auth.token');
  
  console.log('Auth state cleanup completed');
};
