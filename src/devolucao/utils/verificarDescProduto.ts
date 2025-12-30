import { CreateProdutoDto } from 'src/produto/dto/create-produto.dto';

export function verificarDescricaoProduto(
  sku: string,
  lista: CreateProdutoDto[],
): string {
  const produto = lista.find((produto) => produto.sku === sku);
  return produto?.descricao || 'produto não encontrado';
}
