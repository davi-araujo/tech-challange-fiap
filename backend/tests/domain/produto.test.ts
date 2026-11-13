import { describe, it, expect } from 'vitest';
import { ProdutoQuimico } from '../../src/1-domain/entities/ProdutoQuimico';
import { DomainError } from '../../src/1-domain/error/DomainError';

const dadosValidos = {
  id: 'p1',
  nome: 'Ácido Sulfúrico',
  descricao: 'Líquido corrosivo',
  numeroONU: '1830',
  classeDeRisco: 8,
  grupoDeCompatibilidade: 'ÁCIDOS',
};

describe('Produto químico', () => {
  it('cria produto válido, ativo por padrão', () => {
    const produto = ProdutoQuimico.criar(dadosValidos);

    expect(produto.nome).toBe('Ácido Sulfúrico');
    expect(produto.classeDeRisco).toBe(8);
    expect(produto.status).toBe(true);
  });

  it('rejeita produto sem nome', () => {
    expect(() => ProdutoQuimico.criar({ ...dadosValidos, nome: '' })).toThrow(DomainError);
  });

  it('rejeita produto sem classe de risco', () => {
    expect(() => ProdutoQuimico.criar({ ...dadosValidos, classeDeRisco: 0 })).toThrow(DomainError);
  });

  it('rejeita grupo de compatibilidade inválido', () => {
    expect(() =>
      ProdutoQuimico.criar({ ...dadosValidos, grupoDeCompatibilidade: 'GRUPO INEXISTENTE' }),
    ).toThrow(DomainError);
  });

  it('inativa um produto ativo', () => {
    const produto = ProdutoQuimico.criar(dadosValidos);

    produto.inativar();

    expect(produto.status).toBe(false);
  });

  it('não inativa um produto que já está inativo', () => {
    const produto = ProdutoQuimico.criar(dadosValidos);
    produto.inativar();

    expect(() => produto.inativar()).toThrow(DomainError);
  });

  it('reativa um produto inativo e não reativa um ativo', () => {
    const produto = ProdutoQuimico.criar(dadosValidos);

    expect(() => produto.ativar()).toThrow(DomainError);

    produto.inativar();
    produto.ativar();

    expect(produto.status).toBe(true);
  });
});
