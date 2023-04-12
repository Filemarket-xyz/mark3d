import { createMnemonic } from './createMnemonic'
import { EnterSeedPhraseValue } from '../../EnterSeedPhraseWindow/EnterSeedPhraseForm/EnterSeedPhraseForm'
import { rootStore } from '../../../../stores/RootStore'

export const onCreateAccountButtonHandle = () => {
  const mnemonic = createMnemonic()
  localStorage.setItem('mnemonic', mnemonic)
  return mnemonic
}

export const onImportAccountButtonHandle = async (mnemonic: EnterSeedPhraseValue): Promise<void> => {
  if (localStorage.getItem('mnemonic') === mnemonic.seedPhrase) {
    rootStore.authStore.setIsAuth(true)
  }
}
