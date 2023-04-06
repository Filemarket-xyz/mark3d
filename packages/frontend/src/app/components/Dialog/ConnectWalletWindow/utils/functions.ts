import {createMnemonic} from "./createMnemonic";

export const onCreateAccountButtonHandle = () => {
    const mnemonic = createMnemonic();
    localStorage.setItem('mnemonic', mnemonic)
}

export const onImportAccountButtonHandle = (mnemonic: string): boolean => {
    if (localStorage.getItem('mnemonic') === mnemonic) return true
    return false
}