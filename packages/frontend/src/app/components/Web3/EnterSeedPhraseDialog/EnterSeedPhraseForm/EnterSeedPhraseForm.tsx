import React, { FC } from 'react'
import { useForm } from 'react-hook-form'

import { styled } from '../../../../../styles'
import { ButtonGlowing, Txt } from '../../../../UIkit'
import { ErrorMessage } from '../../../../UIkit/Form/ErrorMessage'
import { InputModalTitleText, ModalBanner } from '../../../../UIkit/Modal/Modal'
import PasswordInput from '../../../Form/PasswordInput/PasswordInput'
import { validateImportMnemonic, validatePassword } from '../../ConnectFileWalletDialog/utils/validate'
import { FormControlStyle } from '../../CreateMnemonicDialog/CreatePasswordForm/CreatePasswordForm'

const FormEnterSeedPhraseStyle = styled('form', {
  width: '100%',
  margin: '0 auto',
})

export interface EnterSeedPhraseValue {
  seedPhrase: string
  password: string
  repeatPassword: string
}

export interface EnterSeedPhraseProps {
  onSubmit: (value: EnterSeedPhraseValue) => void
}

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end',
})

export const EnterSeedPhraseForm: FC<EnterSeedPhraseProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<EnterSeedPhraseValue>()

  const password = watch('password')
  const passwordRepeat = watch('repeatPassword')

  return (
    <FormEnterSeedPhraseStyle onSubmit={handleSubmit(onSubmit)}>
      <FormControlStyle>
        <InputModalTitleText>FileWallet seed phrase</InputModalTitleText>
        <PasswordInput
          inputProps={{
            type: 'password',
            ...register('seedPhrase', { validate: validateImportMnemonic }),
            isError: !!errors?.seedPhrase,
          }}
        />
        {errors?.seedPhrase && <ErrorMessage><Txt h5>{errors.seedPhrase?.message}</Txt></ErrorMessage>}
      </FormControlStyle>
      <FormControlStyle>
        <InputModalTitleText>Create password</InputModalTitleText>
        <PasswordInput
          inputProps={{
            type: 'password',
            ...register('password', { validate: validatePassword }),
            isError: !!errors?.password,
          }}
        />
        {errors?.password && <ErrorMessage><Txt h5>{errors.password?.message}</Txt></ErrorMessage>}
      </FormControlStyle>
      <FormControlStyle style={{ marginBottom: '0' }}>
        <InputModalTitleText>Repeat password</InputModalTitleText>
        <PasswordInput
          inputProps={{
            type: 'password',
            ...register('repeatPassword', { validate: () => password === passwordRepeat ? undefined : 'Password are not matching' }),
            isError: !!errors?.repeatPassword,
          }}
        />
        {errors?.repeatPassword && <ErrorMessage><Txt h5>{errors.repeatPassword?.message}</Txt></ErrorMessage>}
      </FormControlStyle>
      <ModalBanner
        style={{
          marginBottom: '40px',
        }}
      >
        <Txt primary1 style={{ fontSize: '20px', lineHeight: '24px' }}>Note about password</Txt>
        <Txt primary1 style={{ fontWeight: '400', lineHeight: '24px' }}>
          The password will be attached to your current browser/device.
          You can use the same password as on other devices or create a new one.
        </Txt>
      </ModalBanner>
      <ButtonContainer>
        <ButtonGlowing
          whiteWithBlue
          modalButton
          modalButtonFontSize
          type="submit"
          isDisabled={!!(errors.password)}
        >
          Connect
        </ButtonGlowing>
      </ButtonContainer>
    </FormEnterSeedPhraseStyle>
  )
}
