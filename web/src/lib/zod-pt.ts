import { z } from 'zod'

// Mensagens de validação em PT-BR (fallback global). As mensagens específicas
// dos schemas têm prioridade; isto cobre os casos que vazavam em inglês — em
// especial number/NaN nos campos numéricos ("Expected number, received nan").
z.config({
  customError: (issue) => {
    switch (issue.code) {
      case 'invalid_type':
        return 'Campo obrigatório'
      case 'too_small':
        return 'Valor muito curto'
      case 'too_big':
        return 'Valor muito longo'
      case 'invalid_format':
        return 'Formato inválido'
      default:
        return undefined
    }
  },
})
