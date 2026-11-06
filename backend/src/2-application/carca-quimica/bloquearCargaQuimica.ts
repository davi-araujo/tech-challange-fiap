import { NotFoundError } from "../../1-domain/error/DomainError";
import { CargaQuimicaDTO, cargaQuimicaParaDTO } from "./dtos/cargaQuimicaDTO";
import { BuscarCargaQuimicaPorId, SalvarCargaQuimica } from "./ports/cargaQuimicaRepository";

export type BloquearCarga = (id: string | undefined) => Promise<CargaQuimicaDTO>;

export const bloqueiaCarga = (deps: {salvaCarga: SalvarCargaQuimica, buscaPorId: BuscarCargaQuimicaPorId}): BloquearCarga => async (id) => {
    const cargaQuimica = await deps.buscaPorId(id);
    if (!cargaQuimica) throw new NotFoundError("Carga química não encontrada");

    cargaQuimica.bloquearCarga();
    await deps.salvaCarga(cargaQuimica);
    return cargaQuimicaParaDTO(cargaQuimica);
};