import { CargaQuimica } from "../../../1-domain/entities/CargaQuimica";
import { produtoQuimicoParaResumoDTO, ProdutoQuimicoResumoDTO } from "../../produto-quimico/dtos/produtoQuimicoDTO";

export type CargaQuimicaDTO = Readonly<{
   id_carga: string;
   codigo: string;
   quantidade: number;
   unidadeDeMedida: string;
   origem: string;
   destino: string;
   urlDocumentacao: string;
   status: string;
   dataEntrega: string;
   dataCriacao: string;
   dataAtualizacao: string;
   nomeReponsavelTecnico: string;
   produto: ProdutoQuimicoResumoDTO;
}>;

export const cargaQuimicaParaDTO = (cargaQuimica: CargaQuimica): CargaQuimicaDTO => ({
    id_carga: cargaQuimica.id,
    codigo: cargaQuimica.codigo,
    quantidade: cargaQuimica.quantidade,
    unidadeDeMedida: cargaQuimica.unidadeDeMedida,
    origem: cargaQuimica.origem,
    destino: cargaQuimica.destino,
    urlDocumentacao: cargaQuimica.urlDocumentacao,
    status: cargaQuimica.status,
    dataEntrega: cargaQuimica.dataEntrega.toString(),
    dataCriacao: cargaQuimica.dataCriacao.toString(),
    dataAtualizacao: cargaQuimica.dataAtualizacao.toString(),
    nomeReponsavelTecnico: cargaQuimica.nomeReponsavelTecnico,
    produto: produtoQuimicoParaResumoDTO(cargaQuimica.produto),
});