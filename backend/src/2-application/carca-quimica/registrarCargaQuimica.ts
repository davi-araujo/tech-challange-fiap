import { CargaQuimica } from "../../1-domain/entities/CargaQuimica";
import { CargaQuimicaDTO, cargaQuimicaParaDTO } from "./dtos/cargaQuimicaDTO";
import { GerarId } from "../compartilhados/gerarId";
import { SalvarCargaQuimica } from "./ports/cargaQuimicaRepository";
import { BuscarProdutoQuimicoPorId } from "../produto-quimico/ports/produtoQuimicoRepository";
import { DomainError } from "../../1-domain/error/DomainError";

export type RegistrarCargaQuimicaInput = Readonly<{
    codigo: string;
    quantidade: number;
    unidadeDeMedida: string;
    origem: string;
    destino: string;
    urlDocumentacao: string;
    dataEntrega: Date;
    nomeReponsavelTecnico: string;
    produto: string;
}>;

export type RegistraCargaQuimica = (input: RegistrarCargaQuimicaInput) => Promise<CargaQuimicaDTO>;

export const registraCargaQuimica = (deps: { gerarId: GerarId, salvaCarga: SalvarCargaQuimica, buscarProduto: BuscarProdutoQuimicoPorId }): RegistraCargaQuimica => async (params) => {
    const produto = await deps.buscarProduto(params.produto);
    if (!produto) throw new DomainError('Produto químico não encontrado.');

    const cargaQuimica = CargaQuimica.criar({
        id: deps.gerarId(),
        codigo: params.codigo,
        quantidade: params.quantidade,
        unidadeDeMedida: params.unidadeDeMedida,
        origem: params.origem,
        destino: params.destino,
        urlDocumentacao: params.urlDocumentacao,
        dataEntrega: params.dataEntrega,
        nomeReponsavelTecnico: params.nomeReponsavelTecnico,
        produto: produto,
    });

    await deps.salvaCarga(cargaQuimica);
    return cargaQuimicaParaDTO(cargaQuimica);
};