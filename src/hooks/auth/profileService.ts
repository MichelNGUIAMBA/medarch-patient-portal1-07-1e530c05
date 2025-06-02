
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    if (profileData && ['admin', 'secretary', 'nurse', 'lab', 'doctor'].includes(profileData.role)) {
      return profileData as Profile;
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    return null;
  }
};
