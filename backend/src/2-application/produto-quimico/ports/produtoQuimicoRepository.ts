import { ProdutoQuimico } from '../../../1-domain/entities/ProdutoQuimico';

export type BuscarProdutoQuimicoPorId = (id: string | undefined) => Promise<ProdutoQuimico | null>;
export type SalvarProdutoQuimico = (produtoQuimico: ProdutoQuimico) => Promise<void>;
export type ListarProdutosQuimicos = () => Promise<readonly ProdutoQuimico[]>;

export type ProdutoQuimicoRepository = Readonly<{
    salvar: SalvarProdutoQuimico;
    buscarPorId: BuscarProdutoQuimicoPorId;
    listar: ListarProdutosQuimicos;
}>;