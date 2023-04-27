import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { Button } from '../../../../../UIkit'
import { useSetPublicKey } from '../../../../../processing'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal from '../../../../Modal/Modal'

export interface ButtonSetPublicKeyTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonSetPublicKeyTransfer: FC<ButtonSetPublicKeyTransferProps> = ({ tokenFullId, callback }) => {
  const { setPublicKey, ...statuses } = useSetPublicKey(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Public key was sent. The owner can now give you access to the hidden file.',
    loadingMsg: 'Sending keys, so owner could encrypt the file password and transfer it to you'
  })
  return (
    <>
      <MintModal {...modalProps}/>
      <Button
        primary
        fullWidth
        borderRadiusSecond
        onPress={async () => {
          await setPublicKey()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        Accept transfer
      </Button>
    </>
  )
}
