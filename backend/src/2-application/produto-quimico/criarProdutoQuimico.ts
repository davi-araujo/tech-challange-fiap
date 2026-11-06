import { ProdutoQuimico } from "../../1-domain/entities/ProdutoQuimico";
import { GerarId } from "../compartilhados/gerarId";
import { ProdutoQuimicoDTO, produtoQuimicoParaDTO } from "./dtos/produtoQuimicoDTO";
import { SalvarProdutoQuimico } from "./ports/produtoQuimicoRepository";

export type CriarProdutoQuimicoInput = Readonly<{
    nome: string;
    descricao: string;
    numeroONU: string;
    classeDeRisco: number;
    grupoDeCompatibilidade: string;
}>;

export type CriarProdutoQuimico = (input: CriarProdutoQuimicoInput) => Promise<ProdutoQuimicoDTO>;

export const criaProdutoQuimico = (deps: {salvaProduto: SalvarProdutoQuimico, geraId: GerarId}): CriarProdutoQuimico => async (params) => {
    const produto = ProdutoQuimico.criar({
        id: deps.geraId(),
        nome: params.nome,
        descricao: params.descricao,
        numeroONU: params.numeroONU,
        classeDeRisco: params.classeDeRisco,
        grupoDeCompatibilidade: params.grupoDeCompatibilidade
    });
    await deps.salvaProduto(produto);
    return produtoQuimicoParaDTO(produto);
};