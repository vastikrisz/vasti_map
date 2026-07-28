const SUPABASE_URL =
    "https://ajpyvnlthhahtyhnndpf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_alRQuYCbSqn08z8a9DJN2A_vNDO5qzO";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);