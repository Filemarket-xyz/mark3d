import React from 'react'

import { Txt } from '../../../UIkit'
import { ModalBanner, ModalDescription } from '../../../UIkit/Modal/Modal'
import ViewMnemonicSection from '../ViewMnemonicDialog/ViewMnemonicSection/ViewMnemonicSection'

interface ShowMnemonicProps {
  mnemonic: string
}

const ShowMnemonic = ({ mnemonic }: ShowMnemonicProps) => {
  return (
    <>
      <ModalDescription>
        This is a key to your files in EFTs.
        {' '}
        <br />
        Remember and save this seed phrase (mnemonic)
      </ModalDescription>
      <ViewMnemonicSection mnemonic={mnemonic} />
      <ModalBanner>
        <Txt primary1 style={{ fontSize: '20px', lineHeight: '24px' }}>That&apos;s important.</Txt>
        <Txt primary1 style={{ fontWeight: '400', lineHeight: '24px' }}>
          You need to save this seed
          phrase somewhere, because it can be used to
          log in from other devices or to restore your
          account in the future.
        </Txt>
        <Txt primary1 style={{ lineHeight: '24px' }}>
          You WON`T get access to your EFTs on another browsers/devices without this seed phrase!
        </Txt>
      </ModalBanner>
    </>
  )
}

export default ShowMnemonic
