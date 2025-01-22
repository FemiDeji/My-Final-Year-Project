import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://rvwwvrqaewtgtvtijbft.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d3d2cnFhZXd0Z3R2dGlqYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTU2ODksImV4cCI6MjA1MjUzMTY4OX0.udfqor72BmwkToNfusPuGvSUHEMGKKV6V6Szb-fS2yk";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
