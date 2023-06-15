import { observer } from 'mobx-react-lite'
import { FC } from 'react'

import BaseModal from '../../../../components/Modal/Modal'
import { useFileBunniesMint } from '../../../../processing/filebunnies/useFileBunniesMint'
import { Button } from '../../../../UIkit'

export const FileBunniesMintButton: FC = observer(() => {
  const { mint, modalProps, isLoading } = useFileBunniesMint()

  const onPress = async () => {
    await mint()
  }

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading}
        onPress={onPress}
      >
        Buy now
      </Button>
    </>
  )
})
