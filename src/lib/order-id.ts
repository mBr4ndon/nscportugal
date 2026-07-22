export function gerarOrderId(prefixo = "PNSC"): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-7);
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase();
  return `${prefixo}${timestamp}${random}`.substring(0, 15);
}
