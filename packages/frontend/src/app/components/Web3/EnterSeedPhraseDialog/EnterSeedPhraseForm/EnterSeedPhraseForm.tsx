import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { styled } from '../../../../../styles'
import { FormControl } from '../../../../UIkit/Form/FormControl'
import { Input } from '../../../../UIkit/Form/Input'
import { Button, Txt } from '../../../../UIkit'
import { validateImportMnemonic, validatePassword } from '../../ConnectFileWalletDialog/utils/validate'
import { ErrorMessage } from '../../../../UIkit/Form/ErrorMessage'
import {useSeedProvider} from "../../../../processing";
import {useAccount} from "wagmi";

const FormEnterSeedPhraseStyle = styled('form', {
  paddingTop: '2rem',
  width: '80%',
  margin: '0 auto'
})

export interface EnterSeedPhraseValue {
  seedPhrase: string
  password: string
}

export interface EnterSeedPhraseProps {
  onSubmit: (value: EnterSeedPhraseValue) => void
}

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end'
})

export const EnterSeedPhraseForm: FC<EnterSeedPhraseProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EnterSeedPhraseValue>()
    const { address } = useAccount()
    const { seedProvider } = useSeedProvider(address)
  return (
        <FormEnterSeedPhraseStyle onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <Input
                    type="string"
                    placeholder={seedProvider?.mnemonic ? 'Enter a new seed-phrase' : 'Enter a seed-phrase'}
                    {...register('seedPhrase', { validate: validateImportMnemonic })}
                    isError={!!errors?.seedPhrase}
                />
                {errors?.seedPhrase && <ErrorMessage><Txt h5>{errors.seedPhrase?.message}</Txt></ErrorMessage>}
            </FormControl>
            <FormControl>
                <Input
                    type="password"
                    placeholder='Enter your password'
                    {...register('password', { validate: validatePassword })}
                    isError={!!errors?.password}
                />
                {errors?.password && <ErrorMessage><Txt h5>{errors.password?.message}</Txt></ErrorMessage>}
            </FormControl>
            <ButtonContainer>
                <Button
                    type="submit"
                    primary
                    isDisabled={!!(errors.seedPhrase || errors.password)}
                >
                    Sign in
                </Button>
            </ButtonContainer>
        </FormEnterSeedPhraseStyle>
  )
}
