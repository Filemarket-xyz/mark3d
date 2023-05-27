import { validateMnemonic, wordlists } from 'bip39'

import { SupportedLocale } from './locale'

export const validateImportMnemonic = (str: string): string | undefined => {
  if (!(validateMnemonic(str ?? '', wordlists.english))) {
    return error.en.INVALID_BET
  }
}

export const validatePassword = (value: string): string | undefined => {
  // same requirements as in MetaMask
  if (value.length < 8) {
    return error.en.INVALID_PASSWORD
  }
}

const error: Record<SupportedLocale, Record<string, string>> = {
  en: {
    INVALID_BET: 'Invalid mnemonic',
    INVALID_PASSWORD: 'Password must be at least 8 characters long',
  },
}
