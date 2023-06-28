import { FC, useEffect } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useSetPublicKey } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { ActionButtonProps } from './types/types'

export type ButtonSetPublicKeyTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonSetPublicKeyTransfer: FC<ButtonSetPublicKeyTransferProps> = ({
  tokenFullId,
  callBack,
  isDisabled,
  onError,
}) => {
  const { setPublicKey, ...statuses } = useSetPublicKey({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Public key was sent. The owner can now give you access to the hidden file.',
    loadingMsg: 'Sending keys, so owner could encrypt the file password and transfer it to you',
  })

  const { blockStore } = useStores()
  useEffect(() => {
    if (statuses.result) blockStore.setRecieptBlock(statuses.result.blockNumber)
  }, [statuses.result])

  const onPress = async () => {
    await setPublicKey(tokenFullId).catch(e => {
      onError?.()
      throw e
    })
    callBack?.()
  }

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={onPress}
      >
        Accept transfer
      </Button>
    </>
  )
}
