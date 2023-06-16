import React from 'react'

import { BaseModal } from '../../../../components'
import { useStores } from '../../../../hooks'
import { useFileBunniesFreeMint } from '../../../../processing/filebunnies/useFileBunniesFreeMint'
import { WhitelistCard } from '../../../../UIkit'
import { FileBunniesModal, RarityModalBody, RarityModalTitle } from '../FileBunniesModal/FileBunniesModal'

const FileBunniesFreeMintCard = () => {
  const { dialogStore } = useStores()
  const { modalProps, isLoading, freeMint, whiteList } = useFileBunniesFreeMint()

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
          variant: 'free',
        }}
      />
      <BaseModal {...modalProps} />
    </>
  )
}

export default FileBunniesFreeMintCard
