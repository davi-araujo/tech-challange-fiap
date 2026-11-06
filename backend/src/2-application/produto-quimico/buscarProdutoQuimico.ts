import { NotFoundError } from "../../1-domain/error/DomainError";
import { ProdutoQuimicoDTO, produtoQuimicoParaDTO } from "./dtos/produtoQuimicoDTO";
import { BuscarProdutoQuimicoPorId } from "./ports/produtoQuimicoRepository";

export type BuscarProdutoQuimico = (id:string | undefined) => Promise<ProdutoQuimicoDTO>; 

export const buscaProduto = (deps: {buscarPorId: BuscarProdutoQuimicoPorId }): BuscarProdutoQuimico => async (id) => {
    const produtoQuimico = await deps.buscarPorId(id);
    if (!produtoQuimico) throw new NotFoundError('Produto não encontrado.');
    return produtoQuimicoParaDTO(produtoQuimico);
};