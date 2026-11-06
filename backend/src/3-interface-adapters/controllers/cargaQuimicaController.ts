import { ProdutoQuimico } from "../../1-domain/entities/ProdutoQuimico";
import { AlteraStatusCarga } from "../../2-application/carca-quimica/alterarStatusCargaQuimica";
import { BloquearCarga } from "../../2-application/carca-quimica/bloquearCargaQuimica";
import { BuscarCarga } from "../../2-application/carca-quimica/buscarCargaQuimica";
import { CancelarCarga } from "../../2-application/carca-quimica/cancelarCargaQuimica";
import { LiberarCarga } from "../../2-application/carca-quimica/liberarCargaQuimica";
import { ListarCargas } from "../../2-application/carca-quimica/listarCargasQuimicas";
import { RegistraCargaQuimica, RegistrarCargaQuimicaInput } from "../../2-application/carca-quimica/registrarCargaQuimica";
import { trataErro } from "../compartilhados/errorHandling";
import { HttpRequest, HttpResponse } from "../http/HttpTypes";

export type ExecutarChamada = (req: HttpRequest) => Promise<HttpResponse>;

const ENTRADA_INVALIDA = Symbol('entradaInvalida');
export const entradaInvalida = (mensagem: string): Error => Object.assign(new Error(mensagem), { [ENTRADA_INVALIDA]: true });

const lerData = (valor: unknown, campo: string): Date => {
    if (typeof valor !== 'string') {
        throw entradaInvalida(`O campo "${campo}" deve ser uma data em texto (ex.: "2026-12-12").`);
    }
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
        throw entradaInvalida(`O campo "${campo}" não é uma data válida.`);
    }
    return data;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const lerUuid = (valor: unknown, campo: string): string => {
    if (typeof valor !== 'string' || !UUID_REGEX.test(valor)) {
        throw entradaInvalida(`O campo "${campo}" deve ser um UUID válido.`);
    }
    return valor;
};

//validar os inputs para cada usecase que utiliza um input 
const validarRegistraCargaQuimicaInput = (body: unknown): RegistrarCargaQuimicaInput => {
    if (typeof(body) !== 'object' || body === null) throw entradaInvalida("Corpo da requisição inválido;");

    const { codigo, quantidade, unidadeDeMedida, origem, destino, urlDocumentacao, dataEntrega, nomeReponsavelTecnico, produto } = body as Record<string, unknown>;

    if (typeof(codigo) !== "string" || typeof(quantidade) !== "number" || typeof(unidadeDeMedida) !== "string" || typeof(origem) !== "string" || typeof(destino) !== "string" || typeof(urlDocumentacao) !== "string" || typeof(nomeReponsavelTecnico) !== "string") throw entradaInvalida("Carga química precisa ter código, unidade de medida, origem, destino, documentação, data de entrega, nome do responsável técnico e produto.")

    return ({
        codigo: codigo,
        quantidade: quantidade,
        unidadeDeMedida: unidadeDeMedida,
        origem: origem,
        destino: destino,
        urlDocumentacao: urlDocumentacao,
        dataEntrega: lerData(dataEntrega, 'dataEntrega'),
        nomeReponsavelTecnico: nomeReponsavelTecnico,
        produto: lerUuid(produto, 'produto'),
    });
}

//construtor do controller
export type CargaQuimicaController = Readonly<{ registrar: ExecutarChamada, buscar: ExecutarChamada, listar: ExecutarChamada, alterarStatus: ExecutarChamada, liberar: ExecutarChamada, cancelar: ExecutarChamada, bloquear: ExecutarChamada, }>;

//criaController
export const criarCargaQuimicaController = (useCases: {
    registrarCargaQuimica: RegistraCargaQuimica;
    buscarCargaQuimica: BuscarCarga;
    listarCargasQuimicas: ListarCargas;
    alterarStatusCargaQuimica: AlteraStatusCarga;
    liberarCargaQuimica: LiberarCarga;
    cancelarCargaQuimica: CancelarCarga;
    bloquearCargaQuimica: BloquearCarga;
}): CargaQuimicaController => ({
    registrar: trataErro(async ({ body }) => ({
        status: 201,
        body: await useCases.registrarCargaQuimica(validarRegistraCargaQuimicaInput(body)),
    })),
    buscar: trataErro(async ({ params }) => ({
        status: 200,
        body: await useCases.buscarCargaQuimica(params['id']),
    })),
    listar: trataErro(async () => ({
        status: 200,
        body: await useCases.listarCargasQuimicas()
    })),
    alterarStatus: trataErro(async ({ params }) => ({
        status: 200,
        body: await useCases.alterarStatusCargaQuimica(params['id']),
    })),
    liberar: trataErro(async ({ params }) => ({
        status: 200,
        body: await useCases.liberarCargaQuimica(params['id']),
    })),
    cancelar: trataErro(async ({ params} ) => ({
        status: 200,
        body: await useCases.cancelarCargaQuimica(params['id']),
    })),
    bloquear: trataErro(async ({ params }) => ({
        status: 200,
        body: await useCases.bloquearCargaQuimica(params['id']),
    })),
});