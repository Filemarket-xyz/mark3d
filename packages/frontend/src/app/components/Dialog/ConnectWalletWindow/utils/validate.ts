import { SupportedLocale } from './locale'
import { validateMnemonic, wordlists } from 'bip39'
export const validateImportMnemonic = (str: string): string | undefined => {
  console.log(str)
  if (!(validateMnemonic(str ?? '', wordlists.english))) {
    return error.en.INVALID_BET
  }
}

export const validatePassword = (value: string): string | undefined => {
  console.log(value)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!passwordRegex.test(value)) {
    return error.en.INVALID_PASSWORD
  }
}

const error: Record<SupportedLocale, Record<string, string>> = {
  en: {
    INVALID_BET: 'Invalid mnemonic',
    INVALID_PASSWORD: 'Password must be at least 8 characters long, contain letters and numbers'
  }
}
