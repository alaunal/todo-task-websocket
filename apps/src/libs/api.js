import { createClient } from "@supabase/supabase-js";
import { VITE_APP_SUPABASE_URL, VITE_APP_SUPABASE_KEY } from "./constants";

export const supabase = createClient(
    VITE_APP_SUPABASE_URL,
    VITE_APP_SUPABASE_KEY
);