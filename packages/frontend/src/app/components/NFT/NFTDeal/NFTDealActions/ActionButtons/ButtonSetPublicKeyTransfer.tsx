import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useSetPublicKey } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import MintModal from '../../../../Modal/Modal'

export interface ButtonSetPublicKeyTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonSetPublicKeyTransfer: FC<ButtonSetPublicKeyTransferProps> = ({
  tokenFullId,
  callback,
}) => {
  const { setPublicKey, ...statuses } = useSetPublicKey(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Public key was sent. The owner can now give you access to the hidden file.',
    loadingMsg: 'Sending keys, so owner could encrypt the file password and transfer it to you',
  })

  const onPress = async () => {
    await setPublicKey()
    callback?.()
  }

  return (
    <>
      <MintModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading}
        onPress={onPress}
      >
        Accept transfer
      </Button>
    </>
  )
}
