import {createMnemonic} from "./createMnemonic";
import {EnterSeedPhraseValue} from "../../EnterSeedPhraseWindow/EnterSeedPhraseForm/EnterSeedPhraseForm";

export const onCreateAccountButtonHandle = () => {
    const mnemonic = createMnemonic();
    localStorage.setItem('mnemonic', mnemonic)
}

export const onImportAccountButtonHandle = (mnemonic: EnterSeedPhraseValue): boolean => {
    if (localStorage.getItem('mnemonic') === mnemonic.seedPhrase) return true
    return false
}