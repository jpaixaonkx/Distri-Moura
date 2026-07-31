// Lógica de Dashboards e Operações do Funcionário (funcionario.js)
let funcionarioLogado = null;

// Inicialização automática ao carregar o painel do funcionário
window.addEventListener('DOMContentLoaded', () => {
    verificarSessaoFuncionario();
    atualizarStatusCaixaUI();
    carregarEstoqueFuncionario();
    configurarRealtimeEstoque();
    atualizarValoresCaixaFuncionario();
});

function verificarSessaoFuncionario() {
    const funcSalvo = localStorage.getItem('funcionario_logado');
    if (funcSalvo) {
        funcionarioLogado = JSON.parse(funcSalvo);
        const elementoNome = document.getElementById('nome-usuario-logado');
        if (elementoNome) {
            elementoNome.innerText = funcionarioLogado.nome || funcionarioLogado.email;
        }
    } else {
        // Fallback de segurança se acessado diretamente sem login prévio
        funcionarioLogado = { id: 1, nome: 'Colaborador Padrão', email: 'colaborador@moura.com' };
        const elementoNome = document.getElementById('nome-usuario-logado');
        if (elementoNome) {
            elementoNome.innerText = funcionarioLogado.nome;
        }
    }
}

function mostrarSecao(idSecao, elementoBotao) {
    document.querySelectorAll('.secao').forEach(secao => secao.classList.remove('ativa'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    const secaoAlvo = document.getElementById(idSecao);
    if (secaoAlvo) secaoAlvo.classList.add('ativa');
    if (elementoBotao) elementoBotao.classList.add('active');

    if (window.innerWidth <= 768) {
        toggleMobileMenu();
    }
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('mobile-open');
    if (overlay) overlay.classList.toggle('active');
}

function abrirModalVenda() {
    if (!funcionarioLogado) return;
    const caixaAberto = localStorage.getItem(`caixa_aberto_${funcionarioLogado.id}`);
    if (!caixaAberto || caixaAberto === 'false') {
        alert('Você precisa abrir o seu caixa antes de realizar vendas!');
        return;
    }
    const modal = document.getElementById('modal-venda');
    if (modal) modal.style.display = 'flex';
    carregarProdutosSelect();
}

function fecharModalVenda() {
    const modal = document.getElementById('modal-venda');
    if (modal) modal.style.display = 'none';
}

function abrirModalAbrirCaixa() {
    const modal = document.getElementById('modal-abrir-caixa');
    if (modal) modal.style.display = 'flex';
}

function fecharModalAbrirCaixa() {
    const modal = document.getElementById('modal-abrir-caixa');
    if (modal) modal.style.display = 'none';
}

function sairSistema() {
    if (confirm('Deseja realmente sair do painel?')) {
        localStorage.removeItem('funcionario_logado');
        window.location.href = 'index.html';
    }
}

// --- CONTROLE DE CAIXA ---
function confirmarAberturaCaixa(event) {
    event.preventDefault();
    if (!funcionarioLogado) return;
    
    const trocoInput = document.getElementById('valor-troco-inicial');
    const troco = trocoInput ? trocoInput.value : '0.00';
    
    localStorage.setItem(`caixa_aberto_${funcionarioLogado.id}`, 'true');
    localStorage.setItem(`caixa_troco_${funcionarioLogado.id}`, troco);
    
    alert('Caixa aberto com sucesso!');
    fecharModalAbrirCaixa();
    atualizarStatusCaixaUI();
}

function fecharCaixaFuncionario() {
    if (!funcionarioLogado) return;
    if (confirm('Tem certeza que deseja fechar o seu caixa e encerrar os lançamentos do dia?')) {
        localStorage.setItem(`caixa_aberto_${funcionarioLogado.id}`, 'false');
        alert('Caixa fechado com sucesso.');
        atualizarStatusCaixaUI();
    }
}

function atualizarStatusCaixaUI() {
    if (!funcionarioLogado) return;
    const aberto = localStorage.getItem(`caixa_aberto_${funcionarioLogado.id}`) === 'true';
    const badge = document.getElementById('badge-status-caixa');
    const btnAbrir = document.getElementById('btn-abrir-caixa');
    const btnFechar = document.getElementById('btn-fechar-caixa');

    if (badge) {
        if (aberto) {
            badge.className = 'badge-status status-aberto';
            badge.innerText = 'CAIXA ABERTO';
        } else {
            badge.className = 'badge-status status-fechado';
            badge.innerText = 'CAIXA FECHADO';
        }
    }

    if (btnAbrir) btnAbrir.style.display = aberto ? 'none' : 'flex';
    if (btnFechar) btnFechar.style.display = aberto ? 'flex' : 'none';
}

// --- ESTOQUE EM TEMPO REAL COM SUPABASE ---
async function carregarEstoqueFuncionario() {
    try {
        const { data, error } = await supabaseClient.from('estoque').select('*');
        if (error) throw error;

        const tbody = document.getElementById('lista-estoque-funcionario');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        if (data && data.length > 0) {
            data.forEach(item => {
                tbody.innerHTML += `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${item.nome_produto}</td>
                        <td><span class="badge-blue">${item.quantidade_atual} un</span></td>
                        <td>R$ ${Number(item.preco_venda).toFixed(2)}</td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#a3b8cc;">Nenhum produto cadastrado no estoque.</td></tr>`;
        }
    } catch (e) {
        console.error('Erro ao carregar estoque:', e);
    }
}

function configurarRealtimeEstoque() {
    if (typeof supabaseClient !== 'undefined' && supabaseClient.channel) {
        supabaseClient
            .channel('public:estoque')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'estoque' }, () => {
                carregarEstoqueFuncionario();
            })
            .subscribe();
    }
}

async function carregarProdutosSelect() {
    try {
        const { data } = await supabaseClient.from('estoque').select('*');
        const select = document.getElementById('venda-produto');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione um produto</option>';
        if (data) {
            data.forEach(p => {
                if (p.quantidade_atual > 0) {
                    select.innerHTML += `<option value="${p.id}" data-preco="${p.preco_venda}" data-qtdmax="${p.quantidade_atual}">${p.nome_produto} (Disponível: ${p.quantidade_atual}) - R$ ${p.preco_venda}</option>`;
                }
            });
        }
    } catch (e) {
        console.error('Erro ao carregar produtos para select:', e);
    }
}

// --- REALIZAR VENDA (PDV) ---
async function realizarVendaFuncionario(event) {
    event.preventDefault();
    if (!funcionarioLogado) return;

    const produtoId = document.getElementById('venda-produto').value;
    const quantidadeVendida = parseInt(document.getElementById('venda-qtd').value);
    const formaPagamento = document.getElementById('venda-pagamento').value;

    if (!produtoId) {
        alert('Selecione um produto válido.');
        return;
    }

    try {
        const { data: prodData, error: prodError } = await supabaseClient
            .from('estoque')
            .select('*')
            .eq('id', produtoId)
            .single();

        if (prodError || !prodData) throw new Error('Produto não encontrado.');

        if (prodData.quantidade_atual < quantidadeVendida) {
            alert(`Estoque insuficiente! Apenas ${prodData.quantidade_atual} unidades disponíveis.`);
            return;
        }

        const valorTotal = Number(prodData.preco_venda) * quantidadeVendida;
        const novaQuantidade = prodData.quantidade_atual - quantidadeVendida;

        const { error: updateError } = await supabaseClient
            .from('estoque')
            .update({ quantidade_atual: novaQuantidade })
            .eq('id', produtoId);

        if (updateError) throw updateError;

        await supabaseClient.from('vendas').insert([{
            funcionario_id: funcionarioLogado.id || null,
            funcionario_nome: funcionarioLogado.nome || 'Colaborador',
            forma_pagamento: formaPagamento,
            subtotal: valorTotal,
            valor_total: valorTotal,
            data_venda: new Date().toISOString()
        }]);

        alert(`Venda realizada com sucesso! Total: R$ ${valorTotal.toFixed(2)}`);
        fecharModalVenda();
        
        const formVenda = document.getElementById('form-venda-func');
        if (formVenda) formVenda.reset();
        
        carregarEstoqueFuncionario();
        atualizarValoresCaixaFuncionario();

    } catch (err) {
        console.error('Erro ao processar venda:', err);
        alert('Erro ao processar a venda. Tente novamente.');
    }
}

// --- ATUALIZAR VALORES DO CAIXA DO FUNCIONÁRIO ---
async function atualizarValoresCaixaFuncionario() {
    try {
        const { data, error } = await supabaseClient
            .from('vendas')
            .select('valor_total, data_venda, funcionario_nome, funcionario_id');

        if (!error && data && funcionarioLogado) {
            let hojeTotal = 0;
            let semanaTotal = 0;
            let mesTotal = 0;

            const agora = new Date();
            const hojeStr = agora.toISOString().split('T')[0];

            data.forEach(v => {
                const mesmoNome = v.funcionario_nome && funcionarioLogado.nome && v.funcionario_nome.toLowerCase().trim() === funcionarioLogado.nome.toLowerCase().trim();
                const mesmoId = v.funcionario_id && funcionarioLogado.id && String(v.funcionario_id) === String(funcionarioLogado.id);
                
                if (!mesmoNome && !mesmoId) {
                    return;
                }

                const dataVendaObj = new Date(v.data_venda);
                const vendaStr = dataVendaObj.toISOString().split('T')[0];
                const valor = Number(v.valor_total || 0);

                if (vendaStr === hojeStr) {
                    hojeTotal += valor;
                }

                if (dataVendaObj.getMonth() === agora.getMonth() && dataVendaObj.getFullYear() === agora.getFullYear()) {
                    mesTotal += valor;
                }

                const diffTime = Math.abs(agora - dataVendaObj);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) {
                    semanaTotal += valor;
                }
            });

            if (document.getElementById('caixa-dia')) document.getElementById('caixa-dia').innerText = `R$ ${hojeTotal.toFixed(2)}`;
            if (document.getElementById('caixa-semana')) document.getElementById('caixa-semana').innerText = `R$ ${semanaTotal.toFixed(2)}`;
            if (document.getElementById('caixa-mes')) document.getElementById('caixa-mes').innerText = `R$ ${mesTotal.toFixed(2)}`;
        }
    } catch (e) {
        console.error('Erro ao atualizar valores de caixa:', e);
    }
}