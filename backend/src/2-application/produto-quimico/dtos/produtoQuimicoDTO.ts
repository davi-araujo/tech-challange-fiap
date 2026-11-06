import { ProdutoQuimico } from "../../../1-domain/entities/ProdutoQuimico";

export type ProdutoQuimicoDTO = Readonly<{
    id: string;
    nome: string;
    descricao: string;
    numeroONU: string;
    classeDeRisco: number;
    grupoDeCompatibilidade: string;
    status: boolean;
    dataCriacao: string;
    dataAtualizacao: string;
}>;

export type ProdutoQuimicoResumoDTO = Readonly<{
    id: string;
    nome: string;
    numeroONU: string;
    classeDeRisco: number;
    grupoDeCompatibilidade: string;
}>;

export const produtoQuimicoParaDTO = (produtoQuimico: ProdutoQuimico): ProdutoQuimicoDTO => ({
    id: produtoQuimico.id,
    nome: produtoQuimico.nome,
    descricao: produtoQuimico.descricao,
    numeroONU: produtoQuimico.numeroONU,
    classeDeRisco: produtoQuimico.classeDeRisco,
    grupoDeCompatibilidade: produtoQuimico.grupoDeCompatibilidade,
    status: produtoQuimico.status,
    dataCriacao: produtoQuimico.dataCriacao.toString(),
    dataAtualizacao: produtoQuimico.dataAtualizacao.toString(),
});

export const produtoQuimicoParaResumoDTO = (produtoQuimico: ProdutoQuimico): ProdutoQuimicoResumoDTO => ({
    id: produtoQuimico.id,
    nome: produtoQuimico.nome,
    numeroONU: produtoQuimico.numeroONU,
    classeDeRisco: produtoQuimico.classeDeRisco,
    grupoDeCompatibilidade: produtoQuimico.grupoDeCompatibilidade,
});