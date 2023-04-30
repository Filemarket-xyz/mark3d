import { Modal } from '@nextui-org/react'
import { mnemonicToEntropy } from 'bip39'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import { useStores } from '../../../hooks'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useSeedProviderFactory } from '../../../processing'
import { Button, Txt } from '../../../UIkit'
import { AppDialogProps } from '../../../utils/dialog'
import { ButtonContainer } from '../../MarketCard/NFTCard'
import { ModalTitle } from '../../Modal/Modal'
import { createMnemonic } from '../ConnectFileWalletDialog/utils/createMnemonic'
import { CreatePasswordForm } from './CreatePasswordForm/CreatePasswordForm'

const CreatedMnemonicStyle = styled('div', {
  width: '90%',
  position: 'relative',
  margin: '0 auto',
  fontSize: '12px',
  '& button': {
    padding: '5px',
    marginTop: '20px',
    color: 'white'
  },

  '& .contentModalWindow': {
    width: '100%'
  },

  '& .closeButton': {
    top: '-35px !important'
  },
  paddingBottom: '30px',

  '& .grayText span': {
    color: '$gray400',
    fontSize: '0.8rem'
  },
  '& .mnemonic': {
    textAlign: 'justify',
    '& span': {
      fontSize: '1.25rem'
    },
    padding: '1rem 0'
  },
  '@md': {
    fontSize: '15px'
  },
  '@ld': {
    fontSize: '18px'
  }

})

export function CreateMnemonicDialog({ open, onClose }: AppDialogProps<{}>): JSX.Element {
  useCloseIfNotConnected(onClose)
  const { adaptive } = useMediaMui()
  const [mnemonic, setMnemonic] = useState<string>()
  const { dialogStore } = useStores()
  const { address } = useAccount()
  const seedProviderFactory = useSeedProviderFactory()
  return (
    <Modal
      closeButton
      open={open}
      onClose={onClose}
      width={adaptive({
        sm: '400px',
        md: '650px',
        lg: '950px',
        defaultValue: '950px'
      })}
    >
      <ModalTitle>{mnemonic ? 'Remember this phrase' : 'Enter a password'}</ModalTitle>
      <CreatedMnemonicStyle>
        <div className="contentModalWindow">
          {mnemonic && <>
              <div className="mnemonic">
                  <Txt h5>{mnemonic}</Txt>
              </div>
              <div className="grayText">
                  <Txt h5>You need to save this phrase somewhere, because
                      it will be used to log in to other devices or
                      restore your account in the future</Txt>
              </div>
          </>}
          {!mnemonic && <CreatePasswordForm onSubmit={async ({ password }) => {
            if (address) {
              const seedProvider = await seedProviderFactory.getSeedProvider(address)
              const newMnemonic = createMnemonic()
              const seed = Buffer.from(mnemonicToEntropy(newMnemonic))
              // console.log(entropyToMnemonic(seed.toString()))
              await seedProvider.set(seed, password)
              setMnemonic(newMnemonic)
              dialogStore.closeDialogByName('ConnectMain')
            }
          }} />}
        </div>
        {mnemonic &&
            <ButtonContainer>
                <Button
                    type="submit"
                    primary
                    onClick={onClose}
                >
                    Ok
                </Button>
            </ButtonContainer>}
      </CreatedMnemonicStyle>
    </Modal>
  )
}
