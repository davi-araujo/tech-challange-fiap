import { CargaQuimica } from "../../../1-domain/entities/CargaQuimica";
import { BuscarProdutoQuimicoPorId } from "../../produto-quimico/ports/produtoQuimicoRepository";


export type BuscarCargaQuimicaPorId = (id: string | undefined) => Promise<CargaQuimica | null>;
export type SalvarCargaQuimica = (carcaQuimica: CargaQuimica) => Promise<void>;
export type ListarCargasQuimicas = () => Promise<readonly CargaQuimica[]>;

export type CargaQuimicaRepository = Readonly<{
    salvar: SalvarCargaQuimica;
    buscarPorId: BuscarCargaQuimicaPorId;
    listar: ListarCargasQuimicas;
    buscaProdutoPorId: BuscarProdutoQuimicoPorId;
}>;