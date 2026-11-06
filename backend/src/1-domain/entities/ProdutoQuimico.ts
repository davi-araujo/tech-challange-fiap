import { DomainError } from '../error/DomainError';

const gruposDeCompatibilidade = ['ÁCIDOS','GASES COMPRIMIDOS','LÍQUIDOS INFLAMÁVEIS','OXIDANTES LÍQUIDOS'];

export class ProdutoQuimico {
    private constructor(
        readonly id: string,
        readonly nome: string,
        readonly descricao: string,
        readonly numeroONU: string,         // 4 dígitos
        readonly classeDeRisco: number,     // 1 a 9
        readonly grupoDeCompatibilidade: string,
        private _status: boolean,
        readonly dataCriacao: Date,
        private _dataAtualizacao: Date,
    ) {}

    static criar (params: { id: string; nome: string; descricao: string; numeroONU: string; classeDeRisco: number; grupoDeCompatibilidade: string; }): ProdutoQuimico {
        if (!params.nome) {
            throw new DomainError('Um produto químico precisa ter um nome.');
        }
        if (!params.classeDeRisco) {
            throw new DomainError('Um produto químico precisa ter uma classe de risco.');
        }
        if (!gruposDeCompatibilidade.includes(params.grupoDeCompatibilidade)) {
            throw new DomainError('Grupo de compartibilidade inválido.');
        }

        return new ProdutoQuimico(params.id, params.nome, params.descricao, params.numeroONU, params.classeDeRisco, params.grupoDeCompatibilidade, true, new Date(), new Date());
    }

    static reconstruir (params: { id: string; nome: string; descricao: string; numeroONU: string; classeDeRisco: number; grupoDeCompatibilidade: string; status: boolean; dataCriacao: Date; dataAtualizacao: Date; }): ProdutoQuimico {
        if (!params.nome) {
            throw new DomainError('Um produto químico precisa ter um nome.');
        }
        if (!params.classeDeRisco) {
            throw new DomainError('Um produto químico precisa ter uma classe de risco.');
        }
        if (!gruposDeCompatibilidade.includes(params.grupoDeCompatibilidade)) {
            throw new DomainError('Grupo de compatibilidade inválido.');
        }

        return new ProdutoQuimico(params.id, params.nome, params.descricao, params.numeroONU, params.classeDeRisco, params.grupoDeCompatibilidade, params.status, params.dataCriacao, params.dataAtualizacao);
    }

    get status(): boolean {
        return this._status;
    }

    get dataAtualizacao(): Date {
        return this._dataAtualizacao;
    }

    ativar(): void {
        if (this._status) {
            throw new DomainError('Este produto químico já está ativo.');
        }
        this._status = true;
        this.mudarDataAtualizacao();
    }

    inativar(): void {
        if (!this._status) {
            throw new DomainError('Este produto químico já está inativo.');
        }
        this._status = false;
        this.mudarDataAtualizacao();
    }

    mudarDataAtualizacao(): void {
        this._dataAtualizacao = new Date();
    }
}