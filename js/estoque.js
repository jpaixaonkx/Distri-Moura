// CRUD de Produtos (Estoque)
async function buscarEstoque() {
    try {
        const { data, error } = await supabaseClient.from('estoque').select('*');
        if (error) throw error;
        return data;
    } catch (e) {
        console.error('Erro ao buscar estoque:', e);
        return [];
    }
}

async function adicionarProdutoEstoque(produto, quantidade, preco) {
    try {
        const { error } = await supabaseClient
            .from('estoque')
            .insert([{ produto, quantidade, preco }]);

        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Erro ao inserir produto:', e);
        return false;
    }
}