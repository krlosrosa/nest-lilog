import { CreateProdutoDto } from 'src/produto/dto/create-produto.dto';

export function verificarEmpresaPorProduto(
  sku: string,
  lista: CreateProdutoDto[],
): string {
  const produto = lista.find((produto) => produto.sku === sku);
  return produto?.empresa || 'produto não encontrado';
}
