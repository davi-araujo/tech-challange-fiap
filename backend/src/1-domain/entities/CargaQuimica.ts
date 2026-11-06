import { DomainError } from '../error/DomainError';
import { ProdutoQuimico } from "./ProdutoQuimico";

const unidadeDeMedida = ['KG', 'MOL', 'L', 'G/L', 'ATM'];

export class CargaQuimica {
    private constructor(
        readonly id: string,
        readonly codigo: string,
        readonly quantidade: number,
        readonly unidadeDeMedida: string,
        readonly origem: string,
        readonly destino: string,
        readonly urlDocumentacao: string,
        private _status: string,
        readonly dataEntrega: Date,
        readonly dataCriacao: Date,
        private _dataAtualizacao: Date,
        readonly nomeReponsavelTecnico: string,
        readonly produto: ProdutoQuimico,
    ) {}

    static criar (params: { id: string; codigo: string; quantidade: number; unidadeDeMedida: string; origem: string; destino: string; urlDocumentacao: string; dataEntrega: Date; nomeReponsavelTecnico: string; produto: ProdutoQuimico; }): CargaQuimica {
        if (!params.produto) {
            throw new DomainError('Uma carga química precisa ter um produto químico.');
        }
        if (!params.produto.status) {
            throw new DomainError('O produto químico precisa estar ativo.');
        }
        if (params.quantidade <= 0) {
            throw new DomainError('Uma carga química precisa ter quantidade maior que 0.');
        }
        if (!params.nomeReponsavelTecnico) {
            throw new DomainError('Uma carga química precisa ter um responsável técnico.');
        }
        if (!unidadeDeMedida.includes(params.unidadeDeMedida)) {
            throw new DomainError('Unidade de medida inválido.');
        }

        return new CargaQuimica(params.id, params.codigo, params.quantidade, params.unidadeDeMedida, params.origem, params.destino, params.urlDocumentacao, 'REGISTRADA', params.dataEntrega, new Date(), new Date(), params.nomeReponsavelTecnico, params.produto);
    }

    static reconstruir (params: { id: string; codigo: string; quantidade: number; unidadeDeMedida: string; origem: string; destino: string; urlDocumentacao: string; dataEntrega: Date; nomeReponsavelTecnico: string; produto: ProdutoQuimico; status: string; dataCriacao: Date; dataAtualizacao: Date }): CargaQuimica {
        if (!params.produto) {
            throw new DomainError('Uma carga química precisa ter um produto químico.');
        }
        if (!params.produto.status) {
            throw new DomainError('O produto químico precisa estar ativo.');
        }
        if (params.quantidade <= 0) {
            throw new DomainError('Uma carga química precisa ter quantidade maior que 0.');
        }
        if (!params.nomeReponsavelTecnico) {
            throw new DomainError('Uma carga química precisa ter um responsável técnico.');
        }
        if (!unidadeDeMedida.includes(params.unidadeDeMedida)) {
            throw new DomainError('Unidade de medida inválido.');
        }

        return new CargaQuimica(params.id, params.codigo, params.quantidade, params.unidadeDeMedida, params.origem, params.destino, params.urlDocumentacao, params.status, params.dataEntrega, params.dataCriacao, params.dataAtualizacao, params.nomeReponsavelTecnico, params.produto);
    }

    get status(): string {
        return this._status;
    }

    get dataAtualizacao(): Date {
        return this._dataAtualizacao;
    }

    private mudarDataAtualizacao(): void {
        this._dataAtualizacao = new Date();
    }

    progredirStatus(): void {
        switch(this._status) {
            case 'REGISTRADA':
                this._status = 'EM ANÁLISE';
                break;

            case 'EM ANÁLISE':
                this._status = 'EM INSPEÇÃO';
                break;

            case 'EM INSPEÇÃO':
                throw new DomainError('Carga em inspeção esperando liberação.');
            
            case 'LIBERADA':
                this._status = 'EM MOVIMENTAÇÃO';
                break;

            case 'EM MOVIMENTAÇÃO':
                this._status = 'FINALIZADA';
                break;

            case 'BLOQUEADA':
            case 'FINALIZADA':
            case 'CANCELADA':
                throw new DomainError(`A carga química não pode progredir de status por estar ${this._status.toLowerCase()}.`);
        }
        this.mudarDataAtualizacao();
    }

    bloquearCarga(): void {
        if (this._status !== 'EM INSPEÇÃO' ) {
            throw new DomainError("Apenas cargas em inspeção podem ser bloqueadas");
        }
        this._status = 'BLOQUEADA';
        this.mudarDataAtualizacao();
    }

    liberarCarga(): void {
        if (this._status !== 'EM INSPEÇÃO' ) {
            throw new DomainError("Apenas cargas em inspeção podem ser liberadas");
        }
        this._status = 'LIBERADA';
        this.mudarDataAtualizacao();
    }

    cancelarCarga(): void {
        if (this._status === 'EM MOVIMENTAÇÃO' || this._status === 'CANCELADA' || this._status === 'FINALIZADA') {
            throw new DomainError(`A carga química não pôde ser cancelada por já estar ${this._status.toLowerCase()}.`);
        }
        this._status = 'CANCELADA';
        this.mudarDataAtualizacao();
    }
}