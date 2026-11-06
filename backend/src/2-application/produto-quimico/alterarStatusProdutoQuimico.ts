import { NotFoundError } from "../../1-domain/error/DomainError";
import { ProdutoQuimicoDTO, produtoQuimicoParaDTO } from "./dtos/produtoQuimicoDTO";
import { BuscarProdutoQuimicoPorId, SalvarProdutoQuimico } from "./ports/produtoQuimicoRepository";

export type AlterarStatusProdutoQuimico = (id: string | undefined) => Promise<ProdutoQuimicoDTO>;

export const alteraStatusProduto = (deps: { buscaPorId: BuscarProdutoQuimicoPorId, salva: SalvarProdutoQuimico }): AlterarStatusProdutoQuimico => async (id) => {
    const produtoQuimico = await deps.buscaPorId(id);
    if (!produtoQuimico) throw new NotFoundError('Produto não encontrado.');
    
    if (produtoQuimico.status) produtoQuimico.inativar(); else produtoQuimico.ativar();
    await deps.salva(produtoQuimico);
    return produtoQuimicoParaDTO(produtoQuimico);
};