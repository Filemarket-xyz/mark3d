import { SupportedLocale } from "../../../../UIkit/locale"
import {validateMnemonic, wordlists} from 'bip39'
export const validateImportMnemonic = (str: string): string => {
    if (!(validateMnemonic(str ?? '', wordlists['english']))) {
        console.log(error['en'].INVALID_BET)
        return error['en'].INVALID_BET
    }
    return 'valid'
}
const error: Record<SupportedLocale, Record<string, string>> = {
    en: {
        INVALID_BET: 'Invalid mnemonic'
    }
}
