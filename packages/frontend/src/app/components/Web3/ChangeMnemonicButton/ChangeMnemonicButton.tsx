import { PressEvent } from '@react-types/shared/src/events'
import { FC } from 'react'

import { useStores } from '../../../hooks'
import { Link } from '../../../UIkit'
import { EnterSeedPhraseDialog } from '../EnterSeedPhraseDialog'

export interface ChangeMnemonicButton {
  onPress?: (e: PressEvent) => void
}

export const ChangeMnemonicButton: FC<ChangeMnemonicButton> = ({ onPress }) => {
  const { dialogStore } = useStores()

  const openDialog = () => {
    dialogStore.openDialog({
      component: EnterSeedPhraseDialog,
      props: {}
    })
  }

  return (
        <Link
            type="button"
            onPress={(e) => {
              openDialog()
              onPress?.(e)
            }}
        >
            Change mnemonic
        </Link>
  )
}
