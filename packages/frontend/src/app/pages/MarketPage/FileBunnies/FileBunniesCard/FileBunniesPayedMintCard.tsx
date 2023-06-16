import React from 'react'

import { BaseModal } from '../../../../components'
import { useStores } from '../../../../hooks'
import { useFileBunniesMint } from '../../../../processing/filebunnies/useFileBunniesMint'
import { WhitelistCard } from '../../../../UIkit'
import { FileBunniesModal, RarityModalBody, RarityModalTitle } from '../FileBunniesModal/FileBunniesModal'

const FileBunniesPayedMintCard = () => {
  const { dialogStore } = useStores()
  const { payedMint, modalProps, isLoading } = useFileBunniesMint()

  const rarityModalOpen = () => {
    dialogStore.openDialog({
      component: FileBunniesModal,
      props: {
        body: <RarityModalBody />,
        title: <RarityModalTitle />,
      },
    })
  }

  return (
    <>
      <WhitelistCard
        variant={'mint'}
        rarityButtonProps={{
          onClick: () => { rarityModalOpen() },
        }}
        buttonProps={{
          onClick: () => { payedMint() },
          variant: 'mint',
          isDisabled: isLoading,
        }}
      />
      <BaseModal {...modalProps} />
    </>
  )
}

export default FileBunniesPayedMintCard
