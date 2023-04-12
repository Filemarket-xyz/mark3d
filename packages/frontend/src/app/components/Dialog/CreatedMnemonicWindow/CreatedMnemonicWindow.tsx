import React, { useState } from 'react'
import { Modal } from '@nextui-org/react'
import { AppDialogProps } from '../../../utils/dialog'
import { styled } from '../../../../styles'
import { ModalTitle } from '../../Modal/Modal'
import { Button, Txt } from '../../../UIkit'
import { useStores } from '../../../hooks'
import { CreatePasswordForm } from './CreatePasswordForm/CreatePasswordForm'
import { createMnemonic } from '../ConnectWalletWindow/utils/createMnemonic'
import { ButtonContainer } from '../../MarketCard/NFTCard'
import { useMediaMui } from '../../../hooks/useMediaMui'

const CreatedMnemonicStyle = styled('div', {
  width: '85%',
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

export function CreatedMnemonicWindow({ open, onClose }: AppDialogProps<{}>): JSX.Element {
  const { authStore } = useStores()
  const { adaptive } = useMediaMui()
  const [mnemonic, setMnemonic] = useState<string>()
  return (
        <Modal
            closeButton
            open={open}
            onClose={onClose}
            width={adaptive({
              sm: '400px',
              md: '650px',
              lg: '950px',
              defaultValue: 'inherit'
            })}
        >
            <ModalTitle>Remember this phrase</ModalTitle>
            <CreatedMnemonicStyle>
                <div className="contentModalWindow">
                    {authStore.isAuth && <>
                    <div className="mnemonic">
                        <Txt h5>{mnemonic}</Txt>
                    </div>
                    <div className="grayText">
                        <Txt h5>You need to save this phrase somewhere, because
                            it will be used to log in to other devices or
                            restore your account in the future</Txt>
                    </div></>}
                    {!authStore.isAuth && <CreatePasswordForm onSubmit={() => {
                      authStore.setIsAuth(true)
                      setMnemonic(createMnemonic())
                    }}/>}
                </div>
                {authStore.isAuth &&
                    <ButtonContainer>
                    <Button
                        type="submit"
                        primary
                    >
                        Okay
                    </Button>
                </ButtonContainer>}
            </CreatedMnemonicStyle>
        </Modal>
  )
}
