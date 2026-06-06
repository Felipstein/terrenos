// Deep-link pro WhatsApp (wa.me). O número é guardado como o usuário digitou;
// aqui extraímos só os dígitos e garantimos o DDI (Brasil = 55) ao montar o link.

function digitsOf(raw: string): string {
  return raw.replace(/\D/g, '')
}

// 10 dígitos (fixo) ou 11 (celular) = número BR sem DDI → prefixa 55.
export function whatsappDigits(raw: string): string {
  const digits = digitsOf(raw)
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  return digits
}

export function buildWhatsappUrl(raw: string): string {
  return `https://wa.me/${whatsappDigits(raw)}`
}

// Aceita formatos comuns (com/sem DDI, com pontuação): exige 10–13 dígitos.
export function isValidWhatsapp(raw: string): boolean {
  const count = digitsOf(raw).length
  return count >= 10 && count <= 13
}
