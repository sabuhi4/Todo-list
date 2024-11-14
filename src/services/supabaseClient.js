// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project URL and API key
const SUPABASE_URL = "https://axepmtbweztdppvmbifi.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZXBtdGJ3ZXp0ZHBwdm1iaWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzODA5NDEsImV4cCI6MjA0Njk1Njk0MX0.BKEWWjsT-wlNmxlJS9OIOyAYvkPKykH2D3oWq7TG8PM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
