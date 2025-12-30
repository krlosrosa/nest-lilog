export function parseBase64Image(
  dataUrl: string,
  fileName: string = 'upload-file',
): File {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) {
    throw new Error('Formato base64 inválido');
  }

  const mimeType = match[1]; // Ex: image/png
  const base64Data = match[2];

  // 1. Converte a string base64 em bytes (Uint8Array)
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  // 2. Cria e retorna o objeto File real
  return new File([byteArray], fileName, { type: mimeType });
}
