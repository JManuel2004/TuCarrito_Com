import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserType = 'buyer' | 'seller' | 'admin';
export type ValidationStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  id_number: string;
  user_type: UserType;
  validation_status: ValidationStatus;
  created_at: string;
  validated_at?: string;
}
