import { ProdutoQuimicoDTO, produtoQuimicoParaDTO } from "./dtos/produtoQuimicoDTO";
import { ListarProdutosQuimicos } from "./ports/produtoQuimicoRepository";

export type ListaProdutosQuimicos = () => Promise<ProdutoQuimicoDTO[]>;

export const listaProdutos = (deps: { listaTodosProdutos: ListarProdutosQuimicos }): ListaProdutosQuimicos => async () => {
    const produtos = await deps.listaTodosProdutos();
    return produtos.map(produto => produtoQuimicoParaDTO(produto));
};