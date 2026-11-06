import { NotFoundError } from "../../1-domain/error/DomainError";
import { CargaQuimicaDTO, cargaQuimicaParaDTO } from "./dtos/cargaQuimicaDTO";
import { BuscarCargaQuimicaPorId, SalvarCargaQuimica } from "./ports/cargaQuimicaRepository";

export type LiberarCarga = (id: string | undefined) => Promise<CargaQuimicaDTO>;

export const liberaCarga = (deps: {salvaCarga: SalvarCargaQuimica, buscaPorId: BuscarCargaQuimicaPorId}): LiberarCarga => async (id) => {
    const cargaQuimica = await deps.buscaPorId(id);
    if (!cargaQuimica) throw new NotFoundError("Carga química não encontrada");

    cargaQuimica.liberarCarga();
    await deps.salvaCarga(cargaQuimica);
    return cargaQuimicaParaDTO(cargaQuimica);
};