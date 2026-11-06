import { Pool } from "pg";
import { criarProdutoQuimicoController, ProdutoQuimicoController } from "../3-interface-adapters/controllers/produtoQuimicoController";
import { criarProdutoQuimicoRepositorioPostgres } from "../4-infrastructure/repositories/produtoQuimicoRepository";
import { criaProdutoQuimico } from "../2-application/produto-quimico/criarProdutoQuimico";
import { buscaProduto } from "../2-application/produto-quimico/buscarProdutoQuimico";
import { listaProdutos } from "../2-application/produto-quimico/listarProdutosQuimicos";
import { randomUUID } from "node:crypto";
import { alteraStatusProduto } from "../2-application/produto-quimico/alterarStatusProdutoQuimico";
import { alteraProdutoQuimico } from "../2-application/produto-quimico/alterarProdutoQuimico";
import { criarCargaQuimicaRepositorioPostgres } from "../4-infrastructure/repositories/cargaQuimicaRepository";
import { criarCargaQuimicaController } from "../3-interface-adapters/controllers/cargaQuimicaController";
import { registraCargaQuimica } from "../2-application/carca-quimica/registrarCargaQuimica";
import { listaCargas } from "../2-application/carca-quimica/listarCargasQuimicas";
import { buscaCarga } from "../2-application/carca-quimica/buscarCargaQuimica";
import { alteraStatusCarga } from "../2-application/carca-quimica/alterarStatusCargaQuimica";
import { bloqueiaCarga } from "../2-application/carca-quimica/bloquearCargaQuimica";
import { cancelaCarga } from "../2-application/carca-quimica/cancelarCargaQuimica";
import { liberaCarga } from "../2-application/carca-quimica/liberarCargaQuimica";
import { criarRotasProdutoQuimico } from "../4-infrastructure/http/ProdutoQuimico.routes";
import { criarRotascargaQuimica } from "../4-infrastructure/http/CargaQuimica.routes";
import { Rota } from "../4-infrastructure/ports/rota";

export const montarContainer = (databaseUrl: string): { pool: Pool, rotas: Rota[] } => {
    const pool = new Pool({ connectionString: databaseUrl });

    const produtoQuimicoRepository = criarProdutoQuimicoRepositorioPostgres(pool);
    const produtoQuimicoController = criarProdutoQuimicoController({
        criarProdutoQuimico: criaProdutoQuimico({ salvaProduto: produtoQuimicoRepository.salvar, geraId: randomUUID }),
        alterarStatusProdutoQuimico: alteraStatusProduto({ buscaPorId: produtoQuimicoRepository.buscarPorId, salva: produtoQuimicoRepository.salvar }),
        buscarProdutoQuimico: buscaProduto({ buscarPorId: produtoQuimicoRepository.buscarPorId }),
        alterarProdutoQuimico: alteraProdutoQuimico({ buscaPorId :produtoQuimicoRepository.buscarPorId, salvaProduto: produtoQuimicoRepository.salvar  }),
        listarProdutoQuimico: listaProdutos({ listaTodosProdutos: produtoQuimicoRepository.listar })
    });

    const cargaQuimicaRepository = criarCargaQuimicaRepositorioPostgres(pool);
    const cargaQuimicaController = criarCargaQuimicaController({
        registrarCargaQuimica: registraCargaQuimica({ salvaCarga: cargaQuimicaRepository.salvar, gerarId: randomUUID, buscarProduto: cargaQuimicaRepository.buscaProdutoPorId }),
        listarCargasQuimicas: listaCargas({ listaCargasQuimicas: cargaQuimicaRepository.listar }),
        buscarCargaQuimica: buscaCarga({ buscaPorId: cargaQuimicaRepository.buscarPorId }),
        alterarStatusCargaQuimica: alteraStatusCarga({ salvaCarga: cargaQuimicaRepository.salvar, buscaPorId: cargaQuimicaRepository.buscarPorId }),
        bloquearCargaQuimica: bloqueiaCarga({ buscaPorId: cargaQuimicaRepository.buscarPorId, salvaCarga: cargaQuimicaRepository.salvar }),
        cancelarCargaQuimica: cancelaCarga({ buscaPorId: cargaQuimicaRepository.buscarPorId, salvaCarga: cargaQuimicaRepository.salvar }),
        liberarCargaQuimica: liberaCarga({ buscaPorId: cargaQuimicaRepository.buscarPorId, salvaCarga: cargaQuimicaRepository.salvar })
    });

    const rotas = [
        ...criarRotasProdutoQuimico(produtoQuimicoController),
        ...criarRotascargaQuimica(cargaQuimicaController),
    ];

    return { pool, rotas };
}