import { ProdutoQuimicoController } from '../../3-interface-adapters/controllers/produtoQuimicoController';
import { type Rota } from '../ports/rota';

export const criarRotasProdutoQuimico = (controller: ProdutoQuimicoController): readonly Rota[] => [
    { method: 'POST', path: '/novoProdutoQuimico', handler: controller.criar },
    { method: 'GET', path: '/produtosQuimicos', handler: controller.listar },
    { method: 'GET', path: '/produtoQuimico/:id', handler: controller.buscar },
    { method: 'PUT', path: '/editarProdutoQuimico/', handler: controller.alterar },
    { method: 'PATCH', path: '/produtoQuimico/:id/alterarStatus', handler: controller.alterarStatus },
];