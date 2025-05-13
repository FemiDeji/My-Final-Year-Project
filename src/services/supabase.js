import { createClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from "../helpers/envData";

export const supabaseUrl = VITE_SUPABASE_URL;
const supabaseKey = VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
