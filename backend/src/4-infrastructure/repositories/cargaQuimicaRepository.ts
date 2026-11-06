import { UUID } from "node:crypto"
import { CargaQuimica } from "../../1-domain/entities/CargaQuimica";
import { CONSULTA_PRODUTO, converteLinhaEmProdutoQuimico, LinhaProduto } from "./produtoQuimicoRepository";
import { entradaInvalida } from "../../3-interface-adapters/controllers/cargaQuimicaController";
import { Pool } from "pg";
import { CargaQuimicaRepository } from "../../2-application/carca-quimica/ports/cargaQuimicaRepository";

type Linha = {
    id: UUID;
    codigo: string;
    quantidade: number;
    unidade_de_medida: string;
    origem: string;
    destino: string;
    url_documentacao: string;
    status: string;
    data_entrega: Date;
    data_criacao: Date;
    data_atualizacao: Date;
    nome_responsavel_tecnico: string;
    id_produto: UUID;
    produto_nome: string;
    produto_descricao: string;
    produto_numeroonu: string;
    produto_classe_de_risco: number;
    produto_compatibilidade: string;
    produto_status: boolean;
    produto_data_criacao: Date;
    produto_data_atualizacao: Date;
}

const CONSULTA = `SELECT cq.id, cq.codigo, cq.quantidade, cq.unidade_de_medida, cq.origem, cq.destino, cq.url_documentacao, cq.status, cq.data_entrega, cq.data_criacao, cq.data_atualizacao, cq.nome_responsavel_tecnico, cq.id_produto, pq.nome as produto_nome, pq.descricao as produto_descricao, pq.numeroonu as produto_numeroonu, pq.classe_de_risco as produto_classe_de_risco, pq.compatibilidade as produto_compatibilidade, pq.status as produto_status, pq.data_criacao as produto_data_criacao, pq.data_atualizacao as produto_data_atualizacao
FROM carga_quimica cq
JOIN produto_quimico pq ON pq.id = cq.id_produto`;

const converteLinhaEmCargaQuimica = (linhas: Linha[]): CargaQuimica[] => {
    const cargasQuimicas: CargaQuimica[] = [];

    for (const l of linhas) {
        const [produto] = converteLinhaEmProdutoQuimico([{
            id: l.id_produto,
            nome: l.produto_nome,
            descricao: l.produto_descricao,
            numeroonu: l.produto_numeroonu,
            classe_de_risco: l.produto_classe_de_risco,
            compatibilidade: l.produto_compatibilidade,
            status: l.produto_status,
            data_criacao: l.produto_data_criacao,
            data_atualizacao: l.produto_data_atualizacao,
        },]);
        
        if (produto === undefined) throw entradaInvalida("Corpo da requisição inválido;");
        
        const dado = { id: l.id.toString(), codigo: l.codigo, quantidade: l.quantidade, unidadeDeMedida: l.unidade_de_medida, origem: l.origem, destino: l.destino, urlDocumentacao: l.url_documentacao, status: l.status, dataEntrega: l.data_entrega, dataCriacao: l.data_criacao, dataAtualizacao: l.data_atualizacao, nomeReponsavelTecnico: l.nome_responsavel_tecnico, produto: produto }

        const cargaQuimica = CargaQuimica.reconstruir(dado);

        cargasQuimicas.push(cargaQuimica);
    }

    return cargasQuimicas;
};

export const criarCargaQuimicaRepositorioPostgres = (pool: Pool): CargaQuimicaRepository => ({
    buscarPorId: async (id) => {
        const { rows } = await pool.query<Linha>(`${CONSULTA} WHERE cq.id = $1`, [id]);
        return converteLinhaEmCargaQuimica(rows)[0] ?? null;
    },
    salvar: async (cargaQuimica: CargaQuimica) => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query(`
                INSERT INTO carga_quimica (
                id, codigo, quantidade, unidade_de_medida, origem, destino, url_documentacao, status, data_entrega, data_criacao, data_atualizacao, nome_responsavel_tecnico, id_produto
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id)
            DO UPDATE SET
                codigo = EXCLUDED.codigo,
                quantidade = EXCLUDED.quantidade,
                unidade_de_medida = EXCLUDED.unidade_de_medida,
                origem = EXCLUDED.origem,
                destino = EXCLUDED.destino,
                url_documentacao = EXCLUDED.url_documentacao,
                status = EXCLUDED.status,
                data_entrega = EXCLUDED.data_entrega,
                data_atualizacao = CURRENT_DATE,
                nome_responsavel_tecnico = EXCLUDED.nome_responsavel_tecnico,
                id_produto = EXCLUDED.id_produto;;
            `,
            [cargaQuimica.id, cargaQuimica.codigo, cargaQuimica.quantidade, cargaQuimica.unidadeDeMedida, cargaQuimica.origem, cargaQuimica.destino, cargaQuimica.urlDocumentacao, cargaQuimica.status, cargaQuimica.dataEntrega, cargaQuimica.dataCriacao, cargaQuimica.dataAtualizacao, cargaQuimica.nomeReponsavelTecnico, cargaQuimica.produto.id]);
            await client.query('COMMIT');
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
    },
    listar: async () => {
        const { rows } = await pool.query<Linha>(`${CONSULTA}`);
        return converteLinhaEmCargaQuimica(rows) ?? null;
    },
    buscaProdutoPorId: async (id) => {
        const { rows } = await pool.query<LinhaProduto>(`${CONSULTA_PRODUTO} WHERE pq.id = $1`, [id]);
        return converteLinhaEmProdutoQuimico(rows)[0] ?? null;
      },
});