import { createClient } from "@supabase/supabase-js";

// Bu bilgileri Supabase Dashboard > Project Settings > API
// bölümünden alacaksınız (Project URL ve anon public key).
const SUPABASE_URL = "https://abzesjsdulzmycacavup.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiemVzanNkdWx6bXljYWNhdnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjIyNDUsImV4cCI6MjA5ODQ5ODI0NX0.DoWjiwYMC4gxX7L9T7D_WBU2Ac_0AQVFhpXlTX6ejfE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
