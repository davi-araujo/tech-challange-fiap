import { ProdutoQuimico } from "../../1-domain/entities/ProdutoQuimico";
import { NotFoundError } from "../../1-domain/error/DomainError";
import { ProdutoQuimicoDTO, produtoQuimicoParaDTO } from "./dtos/produtoQuimicoDTO";
import { BuscarProdutoQuimicoPorId, SalvarProdutoQuimico } from "./ports/produtoQuimicoRepository";

export type AlterarProdutoQuimicoInput = Readonly<{
    id: string;
    nome?: string | undefined;
    descricao?: string | undefined;
    numeroONU?: string | undefined;
    classeDeRisco?: number | undefined;
    grupoDeCompatibilidade?: string | undefined;
}>;

export type AlterarProdutoQuimico = (input: AlterarProdutoQuimicoInput) => Promise<ProdutoQuimicoDTO>;

export const alteraProdutoQuimico = (deps: {salvaProduto: SalvarProdutoQuimico, buscaPorId: BuscarProdutoQuimicoPorId}): AlterarProdutoQuimico => async (input) => {
    const produtoDB = await deps.buscaPorId(input.id);
    if (!produtoDB) throw new NotFoundError('Produto não encontrado.');
    const produto = ProdutoQuimico.reconstruir({id: input.id, nome: input.nome ?? produtoDB.nome, descricao: input.descricao ?? produtoDB.descricao, numeroONU: input.numeroONU ?? produtoDB.numeroONU, classeDeRisco: input.classeDeRisco ?? produtoDB.classeDeRisco, grupoDeCompatibilidade: input.grupoDeCompatibilidade ?? produtoDB.grupoDeCompatibilidade, status: produtoDB.status, dataCriacao: produtoDB.dataCriacao, dataAtualizacao: produtoDB.dataAtualizacao});
    produto.mudarDataAtualizacao();
    await deps.salvaProduto(produto);
    return produtoQuimicoParaDTO(produto);
};