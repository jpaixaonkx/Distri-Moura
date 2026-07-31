// Lógica de Login integrada ao Supabase (Admin / Funcionário)
async function realizarLogin(email, senha, tipoPainel = 'funcionario') {
    try {
        // Consulta no Supabase para buscar o usuário correspondente
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

        // Verifica se o usuário é administrador (pelo cargo na tabela ou pelo e-mail mestre)
        const ehAdmin = (data.cargo === 'admin' || data.email === 'admin@moura.com');

        // VALIDAÇÃO DE SEGURANÇA:
        // Se tentou logar pela mini janela de admin, mas o usuário NÃO é admin no banco:
        if (tipoPainel === 'admin' && !ehAdmin) {
            alert('Acesso negado: Este usuário não possui privilégios administrativos.');
            return false;
        }

        // Se tentou logar pelo painel comum de funcionário, mas o usuário É admin:
        // (Opcional: se quiser impedir admin de logar na tela comum, descomente a linha abaixo)
        /*
        if (tipoPainel === 'funcionario' && ehAdmin) {
            alert('Por favor, utilize o botão "Acesso Admin" no canto da tela para entrar.');
            return false;
        }
        */

        // Salva os dados da sessão atual no navegador
        localStorage.setItem('usuario_logado', JSON.stringify(data));

        // Redireciona com base no privilégio real do usuário no banco
        if (ehAdmin) {
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