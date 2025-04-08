import { createClient } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';

const testSupabase = async () => {
  const { data, error } = await supabase
    .from('leads') // replace 'leads' with your actual table name in Supabase
    .select('*'); // select all data

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Supabase Data:', data);
  }
};

testSupabase();
