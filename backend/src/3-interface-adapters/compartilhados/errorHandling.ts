import { DomainError, NotFoundError } from "../../1-domain/error/DomainError";
import { ExecutarChamada } from "../controllers/produtoQuimicoController"

export const trataErro = (executaChamada: ExecutarChamada): ExecutarChamada => async (req) => {
    try {
        return await executaChamada(req);
    } catch (e) {
        if (e instanceof NotFoundError) return { status: 404, body: { erro: e.message } }
        if (e instanceof DomainError) return { status: 400, body: { erro: e.message } }
        console.error(e)
        return { status: 500, body: { erro: 'Erro interno aconteceu.' } }
    }
}