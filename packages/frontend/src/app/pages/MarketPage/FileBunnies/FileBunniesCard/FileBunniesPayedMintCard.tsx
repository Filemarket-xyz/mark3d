import React from 'react'

import { BaseModal } from '../../../../components'
import { useStores } from '../../../../hooks'
import { useFileBunniesPayedMint } from '../../../../processing/filebunnies/useFileBunniesPayedMint'
import { WhitelistCard } from '../../../../UIkit'
import { FileBunniesModal, RarityModalBody, RarityModalTitle } from '../FileBunniesModal/FileBunniesModal'

const FileBunniesPayedMintCard = () => {
  const { dialogStore } = useStores()
  const { payedMint, modalProps, isLoading } = useFileBunniesPayedMint()

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
          disabled: isLoading,
          onClick: () => { payedMint() },
          variant: 'mint',
        }}
      />
      <BaseModal {...modalProps} />
    </>
  )
}

export default FileBunniesPayedMintCard
