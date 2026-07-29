// js/supabase.js

// Cole aqui as credenciais do seu projeto Supabase
const supabaseUrl = 'https://zvdzuwzcsrtegmbktzrl.supabase.co';
const supabaseKey = 'sb_publishable_to9bswFfc5jVTWhaoRI89g_pOSR-EF3';

// Inicializa o cliente do Supabase
// (A biblioteca do Supabase já está sendo importada via CDN no HTML)
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);