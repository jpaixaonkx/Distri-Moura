// Lógica do Ponto de Venda (PDV) / Botão Flutuante
async function processarVendaPDV(produtoId, quantidadeVendida, formaPagamento) {
    try {
        // 1. Busca produto no estoque
        const { data: prod, error: errProd } = await supabaseClient
            .from('estoque')
            .select('*')
            .eq('id', produtoId)
            .single();

        if (errProd || !prod) throw new Error('Produto não encontrado.');

        if (prod.quantidade < quantidadeVendida) {
            alert('Estoque insuficiente para esta quantidade!');
            return false;
        }

        const valorTotal = prod.preco * quantidadeVendida;
        const novaQtd = prod.quantidade - quantidadeVendida;

        // 2. Dá baixa no estoque
        const { error: errUpdate } = await supabaseClient
            .from('estoque')
            .update({ quantidade: novaQtd })
            .eq('id', produtoId);

        if (errUpdate) throw errUpdate;

        // 3. Registra a venda
        const { error: errVenda } = await supabaseClient
            .from('vendas')
            .insert([{
                produto_id: produtoId,
                produto_nome: prod.produto,
                quantidade: quantidadeVendida,
                valor_total: valorTotal,
                pagamento: formaPagamento
            }]);

        if (errVenda) throw errVenda;

        alert(`Venda realizada com sucesso! Total: R$ ${valorTotal.toFixed(2)}`);
        return true;

    } catch (e) {
        console.error('Erro no PDV:', e);
        alert('Erro ao processar venda no PDV.');
        return false;
    }
}