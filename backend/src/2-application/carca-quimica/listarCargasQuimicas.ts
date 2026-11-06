import { CargaQuimicaDTO, cargaQuimicaParaDTO } from "./dtos/cargaQuimicaDTO";
import { ListarCargasQuimicas } from "./ports/cargaQuimicaRepository";

export type ListarCargas = () => Promise<CargaQuimicaDTO[]>

export const listaCargas = (deps: { listaCargasQuimicas: ListarCargasQuimicas }): ListarCargas => async () => {
    const cargas = await deps.listaCargasQuimicas();
    return cargas.map(carga => cargaQuimicaParaDTO(carga));
};