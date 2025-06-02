
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
      // If no profile found, return null instead of throwing
      if (error.code === 'PGRST116') {
        console.log('No profile found for user:', userId);
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
