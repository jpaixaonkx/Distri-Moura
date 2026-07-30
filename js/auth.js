// Lógica de Login (Admin / Funcionário)
async function realizarLogin(email, senha) {
    try {
        // Usamos .maybeSingle() para evitar erros de cabeçalho (406) do PostgREST
        const { data, error } = await supabaseClient
            .from('funcionarios')
            .select('*')
            .eq('email', email)
            .eq('senha', senha)
            .maybeSingle();

        if (error) {
            console.error('Erro na consulta do Supabase:', error);
            alert('Erro ao tentar conectar com o banco de dados.');
            return false;
        }

        if (!data) {
            alert('E-mail ou senha incorretos.');
            return false;
        }

        // Salva os dados da sessão atual no navegador
        localStorage.setItem('usuario_logado', JSON.stringify(data));

        // Redireciona com base no tipo de acesso
        if (data.email === 'admin@moura.com') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'funcionario.html';
        }
        
        return true;
    } catch (err) {
        console.error('Erro inesperado no login:', err);
        alert('Erro ao tentar realizar login. Verifique sua conexão.');
        return false;
    }
}

function verificarSessao() {
    const usuario = localStorage.getItem('usuario_logado');
    if (!usuario) {
        window.location.href = 'index.html';
    }
}