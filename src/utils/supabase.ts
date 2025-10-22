import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const loadBackgroundsFromDatabase = async () => {
  const { data, error } = await supabase
    .from('backgrounds')
    .select('*');

  if (error) {
    console.error('Error loading backgrounds:', error);
    return [];
  }

  return data || [];
};
