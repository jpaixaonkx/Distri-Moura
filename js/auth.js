// Lógica de Login (Admin / Funcionário)
async function realizarLogin(email, senha) {
    try {
        const { data, error } = await supabaseClient
            .from('funcionarios')
            .select('*')
            .eq('email', email)
            .eq('senha', senha)
            .single();

        if (error || !data) {
            alert('E-mail ou senha incorretos.');
            return false;
        }

        // Salva os dados da sessão atual no navegador
        localStorage.setItem('usuario_logado', JSON.stringify(data));

        // Redireciona com base no tipo ou e-mail (Admin Master)
        if (data.email === 'admin@moura.com') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'funcionario.html';
        }
        return true;
    } catch (err) {
        console.error('Erro no login:', err);
        alert('Erro ao tentar realizar login. Verifique sua conexão.');
        return false;
    }
}

function verificarSessao() {
    const usuario = localStorage.getItem('usuario_logado');
    if (!usuario) {
        window.location.href = 'index.html'; // Redireciona para o login se não autenticado
    }
}