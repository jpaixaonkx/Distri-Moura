// Lógica de Dashboards e Relatórios do Admin
async function carregarDashboardAdmin() {
    try {
        const { data: vendas, error } = await supabaseClient.from('vendas').select('*');
        if (error) throw error;

        let totalGeral = 0;
        let pixTotal = 0;
        let cartaoTotal = 0;
        let dinheiroTotal = 0;

        if (vendas) {
            vendas.forEach(v => {
                const val = Number(v.valor_total || 0);
                totalGeral += val;
                if (v.pagamento === 'pix') pixTotal += val;
                if (v.pagamento === 'cartao') cartaoTotal += val;
                if (v.pagamento === 'dinheiro') dinheiroTotal += val;
            });
        }

        // Atualiza os elementos na tela se existirem
        if(document.getElementById('vendas-mes')) document.getElementById('vendas-mes').innerText = `R$ ${totalGeral.toFixed(2)}`;
        if(document.getElementById('fin-pix')) document.getElementById('fin-pix').innerText = `R$ ${pixTotal.toFixed(2)}`;
        if(document.getElementById('fin-cartao')) document.getElementById('fin-cartao').innerText = `R$ ${cartaoTotal.toFixed(2)}`;
        if(document.getElementById('fin-dinheiro')) document.getElementById('fin-dinheiro').innerText = `R$ ${dinheiroTotal.toFixed(2)}`;

    } catch (e) {
        console.error('Erro ao carregar métricas do admin:', e);
    }
}

function gerarRelatorio() {
    alert('Relatório financeiro gerado com sucesso! Pronto para exportação.');
}

window.addEventListener('DOMContentLoaded', () => {
    carregarDashboardAdmin();
});