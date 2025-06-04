
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile for user:', userId);
    
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      
      // Si aucun profil trouvé, essayons de le créer à partir des données auth
      if (error.code === 'PGRST116') {
        console.log('No profile found, attempting to create one...');
        
        // Récupérer les données de l'utilisateur depuis auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Créer le profil manquant
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: user.user_metadata?.name || user.email || 'Utilisateur',
              role: user.user_metadata?.role || 'secretary'
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }
          
          console.log('Profile created successfully:', newProfile);
          return newProfile as Profile;
        }
        return null;
      }
      throw error;
    }
    
    console.log('Profile data retrieved:', profileData);
    
    if (profileData && ['admin', 'secretary', 'nurse', 'lab', 'doctor'].includes(profileData.role)) {
      return profileData as Profile;
    }
    
    console.log('Profile role not valid:', profileData?.role);
    return null;
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    return null;
  }
};
