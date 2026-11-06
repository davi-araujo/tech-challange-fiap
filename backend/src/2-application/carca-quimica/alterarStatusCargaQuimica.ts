import { NotFoundError } from "../../1-domain/error/DomainError";
import { CargaQuimicaDTO, cargaQuimicaParaDTO } from "./dtos/cargaQuimicaDTO";
import { BuscarCargaQuimicaPorId, SalvarCargaQuimica } from "./ports/cargaQuimicaRepository";

export type AlteraStatusCarga = (id: string | undefined) => Promise<CargaQuimicaDTO>;

export const alteraStatusCarga = (deps: {salvaCarga: SalvarCargaQuimica, buscaPorId: BuscarCargaQuimicaPorId}): AlteraStatusCarga => async (id) => {
    const cargaQuimica = await deps.buscaPorId(id);
    if (!cargaQuimica) throw new NotFoundError("Carga química não encontrada");

    cargaQuimica.progredirStatus();
    await deps.salvaCarga(cargaQuimica);
    return cargaQuimicaParaDTO(cargaQuimica);
};