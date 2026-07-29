// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que a página recarregue
            
            // Pega os valores dos inputs (com o design 3D que criamos)
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const btnSubmit = formLogin.querySelector('button');

            // Feedback visual no botão
            btnSubmit.textContent = 'Carregando...';
            btnSubmit.disabled = true;

            try {
                // 1. Tenta fazer o login via Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: senha,
                });

                if (error) throw error;

                // 2. Busca o perfil do usuário para saber se é Admin ou Funcionário
                const { data: perfilData, error: perfilError } = await supabase
                    .from('perfis')
                    .select('cargo')
                    .eq('id', data.user.id)
                    .single();

                if (perfilError) throw perfilError;

                // 3. Redireciona de acordo com o cargo
                if (perfilData.cargo === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'funcionario.html';
                }

            } catch (error) {
                console.error('Erro de autenticação:', error.message);
                alert('Erro ao fazer login: E-mail ou senha incorretos.');
            } finally {
                // Restaura o botão
                btnSubmit.textContent = 'Entrar';
                btnSubmit.disabled = false;
            }
        });
    }
});