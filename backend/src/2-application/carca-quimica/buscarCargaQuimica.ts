import { NotFoundError } from "../../1-domain/error/DomainError";
import { CargaQuimicaDTO, cargaQuimicaParaDTO } from "./dtos/cargaQuimicaDTO";
import { BuscarCargaQuimicaPorId } from "./ports/cargaQuimicaRepository";

export type BuscarCarga = (id: string | undefined) => Promise<CargaQuimicaDTO>;

export const buscaCarga = (deps: { buscaPorId: BuscarCargaQuimicaPorId}): BuscarCarga => async (id) => {
    const cargaQuimica = await deps.buscaPorId(id);
    if (!cargaQuimica) throw new NotFoundError("Carga química não encontrada");
    return cargaQuimicaParaDTO(cargaQuimica);
};