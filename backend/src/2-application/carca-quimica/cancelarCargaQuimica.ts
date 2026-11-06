import { NotFoundError } from "../../1-domain/error/DomainError";
import { CargaQuimicaDTO, cargaQuimicaParaDTO } from "./dtos/cargaQuimicaDTO";
import { BuscarCargaQuimicaPorId, SalvarCargaQuimica } from "./ports/cargaQuimicaRepository";

export type CancelarCarga = (id: string | undefined) => Promise<CargaQuimicaDTO>;

export const cancelaCarga = (deps: {salvaCarga: SalvarCargaQuimica, buscaPorId: BuscarCargaQuimicaPorId}): CancelarCarga => async (id) => {
    const cargaQuimica = await deps.buscaPorId(id);
    if (!cargaQuimica) throw new NotFoundError("Carga química não encontrada");

    cargaQuimica.cancelarCarga();
    await deps.salvaCarga(cargaQuimica);
    return cargaQuimicaParaDTO(cargaQuimica);
};