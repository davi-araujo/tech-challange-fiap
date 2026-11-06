import { CargaQuimicaController } from '../../3-interface-adapters/controllers/cargaQuimicaController';
import { type Rota } from '../ports/rota';

export const criarRotascargaQuimica = (controller: CargaQuimicaController): readonly Rota[] => [
    { method: 'POST', path: '/registrarCargaQuimica', handler: controller.registrar },
    { method: 'GET', path: '/cargasQuimicas', handler: controller.listar },
    { method: 'GET', path: '/cargaQuimica/:id', handler: controller.buscar },
    { method: 'PATCH', path: '/cargaQuimica/:id/atualizarStatus', handler: controller.alterarStatus },
    { method: 'PATCH', path: '/cargaQuimica/:id/bloquear', handler: controller.bloquear },   
    { method: 'PATCH', path: '/cargaQuimica/:id/liberar', handler: controller.liberar },   
    { method: 'PATCH', path: '/cargaQuimica/:id/cancelar', handler: controller.cancelar },   
]