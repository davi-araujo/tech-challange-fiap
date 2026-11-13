import { describe, it, expect } from 'vitest';
import { ProdutoQuimico } from '../../src/1-domain/entities/ProdutoQuimico';
import { CargaQuimica } from '../../src/1-domain/entities/CargaQuimica';
import { DomainError } from '../../src/1-domain/error/DomainError';

type ParamsCarga = Parameters<typeof CargaQuimica.criar>[0];

const criarProduto = () =>
  ProdutoQuimico.criar({
    id: 'p1',
    nome: 'Ácido Sulfúrico',
    descricao: 'Líquido corrosivo',
    numeroONU: '1830',
    classeDeRisco: 8,
    grupoDeCompatibilidade: 'ÁCIDOS',
  });

const criarCarga = (sobrescrever: Partial<ParamsCarga> = {}) =>
  CargaQuimica.criar({
    id: 'c1',
    codigo: 'CQ-001',
    quantidade: 10,
    unidadeDeMedida: 'KG',
    origem: 'Santos',
    destino: 'Cubatão',
    urlDocumentacao: 'http://exemplo.com/documentacao.pdf',
    dataEntrega: new Date('2026-12-12'),
    nomeReponsavelTecnico: 'Maria Silva',
    produto: criarProduto(),
    ...sobrescrever,
  });

// REGISTRADA -> EM ANÁLISE -> EM INSPEÇÃO
const criarCargaEmInspecao = () => {
  const carga = criarCarga();
  carga.progredirStatus();
  carga.progredirStatus();
  return carga;
};

describe('Registro de carga', () => {
  it('registra carga válida com status REGISTRADA', () => {
    const carga = criarCarga();

    expect(carga.status).toBe('REGISTRADA');
    expect(carga.produto.nome).toBe('Ácido Sulfúrico');
  });

  it('rejeita carga com produto inativo', () => {
    const produto = criarProduto();
    produto.inativar();

    expect(() => criarCarga({ produto })).toThrow(DomainError);
  });

  it.each([0, -5])('rejeita quantidade %i', (quantidade) => {
    expect(() => criarCarga({ quantidade })).toThrow(DomainError);
  });

  it('rejeita carga sem responsável técnico', () => {
    expect(() => criarCarga({ nomeReponsavelTecnico: '' })).toThrow(DomainError);
  });

  it('rejeita unidade de medida inválida', () => {
    expect(() => criarCarga({ unidadeDeMedida: 'XYZ' })).toThrow(DomainError);
  });
});

describe('Fluxo de status', () => {
  it('segue o fluxo principal até FINALIZADA', () => {
    const carga = criarCarga();

    carga.progredirStatus();
    expect(carga.status).toBe('EM ANÁLISE');

    carga.progredirStatus();
    expect(carga.status).toBe('EM INSPEÇÃO');

    carga.liberarCarga();
    expect(carga.status).toBe('LIBERADA');

    carga.progredirStatus();
    expect(carga.status).toBe('EM MOVIMENTAÇÃO');

    carga.progredirStatus();
    expect(carga.status).toBe('FINALIZADA');
  });

  it('não permite finalizar carga que está em inspeção sem liberar', () => {
    const carga = criarCargaEmInspecao();

    expect(() => carga.progredirStatus()).toThrow(DomainError);
    expect(carga.status).toBe('EM INSPEÇÃO');
  });

  it('não permite pular da carga registrada direto para liberada', () => {
    const carga = criarCarga();

    expect(() => carga.liberarCarga()).toThrow(DomainError);
  });
});

describe('Liberação', () => {
  it('libera carga em inspeção com documentação', () => {
    const carga = criarCargaEmInspecao();

    carga.liberarCarga();

    expect(carga.status).toBe('LIBERADA');
  });

  it('não libera carga sem documentação obrigatória', () => {
    const carga = criarCarga({ urlDocumentacao: '' });
    carga.progredirStatus();
    carga.progredirStatus();

    expect(() => carga.liberarCarga()).toThrow(DomainError);
    expect(carga.status).toBe('EM INSPEÇÃO');
  });

  it('não libera carga cancelada', () => {
    const carga = criarCarga();
    carga.cancelarCarga();

    expect(() => carga.liberarCarga()).toThrow(DomainError);
  });
});

describe('Bloqueio', () => {
  it('bloqueia carga em inspeção', () => {
    const carga = criarCargaEmInspecao();

    carga.bloquearCarga();

    expect(carga.status).toBe('BLOQUEADA');
  });

  it('carga bloqueada não entra em movimentação', () => {
    const carga = criarCargaEmInspecao();
    carga.bloquearCarga();

    expect(() => carga.progredirStatus()).toThrow(DomainError);
    expect(carga.status).toBe('BLOQUEADA');
  });

  it('só bloqueia carga que está em inspeção', () => {
    const carga = criarCarga();

    expect(() => carga.bloquearCarga()).toThrow(DomainError);
  });
});

describe('Cancelamento', () => {
  it('cancela carga registrada', () => {
    const carga = criarCarga();

    carga.cancelarCarga();

    expect(carga.status).toBe('CANCELADA');
  });

  it('não cancela carga já em movimentação', () => {
    const carga = criarCargaEmInspecao();
    carga.liberarCarga();
    carga.progredirStatus();

    expect(() => carga.cancelarCarga()).toThrow(DomainError);
  });

  it('carga cancelada não muda mais de estado', () => {
    const carga = criarCarga();
    carga.cancelarCarga();

    expect(() => carga.progredirStatus()).toThrow(DomainError);
    expect(() => carga.cancelarCarga()).toThrow(DomainError);
  });

  it('carga finalizada não pode ser cancelada', () => {
    const carga = criarCargaEmInspecao();
    carga.liberarCarga();
    carga.progredirStatus();
    carga.progredirStatus();

    expect(() => carga.cancelarCarga()).toThrow(DomainError);
  });
});

describe('Reconstrução a partir do banco', () => {
  it('reconstrói carga mesmo que o produto tenha sido inativado depois', () => {
    const produto = criarProduto();
    produto.inativar();

    const carga = CargaQuimica.reconstruir({
      id: 'c1',
      codigo: 'CQ-001',
      quantidade: 10,
      unidadeDeMedida: 'KG',
      origem: 'Santos',
      destino: 'Cubatão',
      urlDocumentacao: 'http://exemplo.com/documentacao.pdf',
      dataEntrega: new Date('2026-12-12'),
      nomeReponsavelTecnico: 'Maria Silva',
      produto,
      status: 'REGISTRADA',
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    });

    expect(carga.status).toBe('REGISTRADA');
    carga.cancelarCarga();
    expect(carga.status).toBe('CANCELADA');
  });
});
