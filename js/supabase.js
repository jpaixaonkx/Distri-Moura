// Configuração e conexão global com o Supabase
const SUPABASE_URL = 'https://crkbuwqkiukajcjfdwop.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JVhb9-m0PMGfeaPp2_leHA_0qZampiK';

// Inicializa o cliente do Supabase globalmente sem redeclarar a biblioteca
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);