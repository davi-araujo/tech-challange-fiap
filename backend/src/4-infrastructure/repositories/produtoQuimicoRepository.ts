import { UUID } from "node:crypto";
import { ProdutoQuimico } from "../../1-domain/entities/ProdutoQuimico";
import { Pool } from "pg";
import { ProdutoQuimicoRepository } from "../../2-application/produto-quimico/ports/produtoQuimicoRepository";

export type LinhaProduto = {
    id: UUID;
    nome: string;
    descricao: string;
    numeroonu: string;
    classe_de_risco: number;
    compatibilidade: string;
    status: boolean;
    data_criacao: Date;
    data_atualizacao: Date;
};

export const CONSULTA_PRODUTO = `SELECT pq.id, pq.nome, pq.descricao, pq.numeroonu, pq.classe_de_risco, pq.compatibilidade, pq.status, pq.data_criacao, pq.data_atualizacao
FROM produto_quimico pq`;

export const converteLinhaEmProdutoQuimico = (linhas: LinhaProduto[]): ProdutoQuimico[] => {
    const produtosQuimicos: ProdutoQuimico[] = [];

    for (const l of linhas) {
        const dado = {id: l.id.toString(), nome: l.nome, descricao: l.descricao, numeroONU: l.numeroonu, classeDeRisco: l.classe_de_risco, grupoDeCompatibilidade: l.compatibilidade, status: l.status, dataCriacao: l.data_criacao, dataAtualizacao: l.data_atualizacao};
        const produtoQuimico = ProdutoQuimico.reconstruir(dado);

        produtosQuimicos.push(produtoQuimico);
    }

    return produtosQuimicos;
}

export const criarProdutoQuimicoRepositorioPostgres = (pool: Pool): ProdutoQuimicoRepository => ({
  buscarPorId: async (id) => {
    const { rows } = await pool.query<LinhaProduto>(`${CONSULTA_PRODUTO} WHERE pq.id = $1`, [id]);
    return converteLinhaEmProdutoQuimico(rows)[0] ?? null;
  },
  salvar: async (produtoQuimico: ProdutoQuimico) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`
        INSERT INTO produto_quimico (
          id, nome, descricao, numeroonu, classe_de_risco, compatibilidade, status, data_criacao, data_atualizacao
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO UPDATE SET
          nome = EXCLUDED.nome,
          descricao = EXCLUDED.descricao,
          numeroonu = EXCLUDED.numeroonu,
          classe_de_risco = EXCLUDED.classe_de_risco,
          compatibilidade = EXCLUDED.compatibilidade,
          status = EXCLUDED.status,
          data_atualizacao = EXCLUDED.data_atualizacao;
      `, [produtoQuimico.id, produtoQuimico.nome, produtoQuimico.descricao, produtoQuimico.numeroONU, produtoQuimico.classeDeRisco, produtoQuimico.grupoDeCompatibilidade, produtoQuimico.status, produtoQuimico.dataCriacao, produtoQuimico.dataAtualizacao]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  listar: async () => {
    const { rows } = await pool.query<LinhaProduto>(`${CONSULTA_PRODUTO}`);
    return converteLinhaEmProdutoQuimico(rows);
  }
});