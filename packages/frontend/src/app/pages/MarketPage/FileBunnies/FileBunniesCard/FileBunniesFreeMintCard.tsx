import React from 'react'

import { BaseModal } from '../../../../components'
import { useStores } from '../../../../hooks'
import { useFileBunniesMint } from '../../../../processing/filebunnies/useFileBunniesMint'
import { WhitelistCard } from '../../../../UIkit'
import { FileBunniesModal, RarityModalBody, RarityModalTitle } from '../FileBunniesModal/FileBunniesModal'

const FileBunniesFreeMintCard = () => {
  const { dialogStore } = useStores()
  const { modalProps, isLoading, freeMint, whiteList } = useFileBunniesMint()

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
        variant={'whitelist'}
        rarityButtonProps={{
          onClick: () => { rarityModalOpen() },
        }}
        buttonProps={{
          isDisabled: isLoading || whiteList === '',
          onClick: () => { freeMint() },
          variant: whiteList === '' ? 'notWl' : 'free',
        }}
      />
      <BaseModal {...modalProps} />
    </>
  )
}

export default FileBunniesFreeMintCard
