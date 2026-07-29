// Configuração e conexão global com o Supabase
const SUPABASE_URL = 'https://zvdzuwzcsrtegmbktzrl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_to9bswFfc5jVTWhaoRI89g_pOSR-EF3';

// Inicializa o cliente do Supabase globalmente sem redeclarar a biblioteca
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);