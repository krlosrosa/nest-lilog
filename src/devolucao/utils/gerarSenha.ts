// gerar senha de 4 digitos aleatórios
export function gerarSenha(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
