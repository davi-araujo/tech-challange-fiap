import { BuscarProdutoQuimico } from "../../2-application/produto-quimico/buscarProdutoQuimico";
import { ListaProdutosQuimicos } from "../../2-application/produto-quimico/listarProdutosQuimicos";
import { AlterarStatusProdutoQuimico } from "../../2-application/produto-quimico/alterarStatusProdutoQuimico";
import { CriarProdutoQuimico, CriarProdutoQuimicoInput } from "../../2-application/produto-quimico/criarProdutoQuimico";
import type { HttpRequest, HttpResponse } from '../http/HttpTypes';
import { trataErro } from "../compartilhados/errorHandling";
import { AlterarProdutoQuimico, AlterarProdutoQuimicoInput } from "../../2-application/produto-quimico/alterarProdutoQuimico";

export type ExecutarChamada = (req: HttpRequest) => Promise<HttpResponse>;

const ENTRADA_INVALIDA = Symbol('entradaInvalida');
const entradaInvalida = (mensagem: string): Error => Object.assign(new Error(mensagem), { [ENTRADA_INVALIDA]: true });

// função para validar o input recebido para criar um novo produto quimico
const validarCriarProdutoQuimicoInput = (body: unknown): CriarProdutoQuimicoInput => {
    if (typeof(body) !== 'object' || body === null) throw entradaInvalida("Corpo da requisição inválido;");

    const { nome, descricao, numeroONU, classeDeRisco, grupoDeCompatibilidade } = body as Record<string, unknown>;

    if (typeof(nome) !== "string" || typeof(descricao) !== "string" || typeof(numeroONU) !== "string" || typeof(classeDeRisco) !== "number" || typeof(grupoDeCompatibilidade) !== "string") throw entradaInvalida("Produto químico precisa ter nome, descrição, numero ONU, classe de risco e grupo de compatibilidade.");

    return ({
        nome: nome,
        descricao: descricao,
        numeroONU: numeroONU,
        classeDeRisco: classeDeRisco,
        grupoDeCompatibilidade: grupoDeCompatibilidade,
    });
};

const validaStringOpcional = (value: unknown): string | undefined => {
    if (typeof(value) === "string") {
        return value;
    } else {
        return undefined;
    }
} 

const validaNumberOpcional = (value: unknown): number | undefined => {
    if (typeof(value) === "number") {
        return value;
    } else {
        return undefined;
    }
} 

// função para validar o input recebido para alterar um produto quimico
const validarAlterarProdutoQuimicoInput = (body: unknown): AlterarProdutoQuimicoInput => {
    if (typeof(body) !== 'object' || body === null) throw entradaInvalida("Corpo da requisição inválido;");

    const { id, nome, descricao, numeroONU, classeDeRisco, grupoDeCompatibilidade } = body as Record<string, unknown>;

    if (typeof(id) !== "string" || id === null) throw entradaInvalida("Para alterar um produto químico é obrigatório passar o seu id");

    if (nome === undefined && descricao === undefined && numeroONU === undefined && classeDeRisco === undefined && grupoDeCompatibilidade === undefined) throw entradaInvalida("É obrigatório passar pelo menos um valor para alteração");

    return ({
        id: id,
        nome: validaStringOpcional(nome),
        descricao: validaStringOpcional(descricao),
        numeroONU: validaStringOpcional(numeroONU),
        classeDeRisco: validaNumberOpcional(classeDeRisco),
        grupoDeCompatibilidade: validaStringOpcional(grupoDeCompatibilidade),
    });
};

//construtor do controller
export type ProdutoQuimicoController = Readonly<{ criar: ExecutarChamada, buscar: ExecutarChamada, listar: ExecutarChamada, alterar: ExecutarChamada,alterarStatus: ExecutarChamada }>;

//para cada caso de uso tem um comportamento (chamando o use case)
export const criarProdutoQuimicoController = (useCases: {
    criarProdutoQuimico: CriarProdutoQuimico;
    buscarProdutoQuimico: BuscarProdutoQuimico;
    listarProdutoQuimico: ListaProdutosQuimicos;
    alterarProdutoQuimico: AlterarProdutoQuimico;
    alterarStatusProdutoQuimico: AlterarStatusProdutoQuimico;
}): ProdutoQuimicoController => ({
    criar: trataErro(async ({ body }) => ({
        status: 201,
        body: await useCases.criarProdutoQuimico(validarCriarProdutoQuimicoInput(body)),
    })),
    buscar: trataErro(async ({ params }) => ({
        status: 200,
        body: await useCases.buscarProdutoQuimico(params['id']),
    })),
    listar: trataErro(async () => ({
        status: 200,
        body: await useCases.listarProdutoQuimico(),
    })),
    alterar: trataErro(async ({ body }) => ({
        status: 200,
        body: await useCases.alterarProdutoQuimico(validarAlterarProdutoQuimicoInput(body)),
    })),
    alterarStatus: trataErro(async ({ params }) => ({
        status: 200,
        body: await useCases.alterarStatusProdutoQuimico(params['id']),
    })),
});