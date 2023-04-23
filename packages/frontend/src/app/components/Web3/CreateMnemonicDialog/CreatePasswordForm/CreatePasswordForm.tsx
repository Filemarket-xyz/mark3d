import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { styled } from '../../../../../styles'
import { FormControl } from '../../../../UIkit/Form/FormControl'
import { Input } from '../../../../UIkit/Form/Input'
import { Button, Txt } from '../../../../UIkit'
import { validatePassword } from '../../ConnectFileWalletDialog/utils/validate'
import { ErrorMessage } from '../../../../UIkit/Form/ErrorMessage'

const CreatePasswordStyle = styled('form', {
  paddingTop: '2rem',
  width: '80%',
  margin: '0 auto'
})

export interface CreatePasswordValue {
  password: string
    repeatPassword: string
}

export interface CreatePasswordProps {
  onSubmit: (value: CreatePasswordValue) => void
}

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end'
})

export const CreatePasswordForm: FC<CreatePasswordProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreatePasswordValue>()

    const password = watch('password')
    const passwordRepeat = watch('repeatPassword')

  return (
        <CreatePasswordStyle onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <Input
                    type="password"
                    placeholder='Create a password'
                    {...register('password', { validate: validatePassword })}
                    isError={!!errors?.password}
                />
                {errors?.password && <ErrorMessage><Txt h5>{errors.password?.message}</Txt></ErrorMessage>}
            </FormControl>
            <FormControl>
                <Input
                    type="password"
                    placeholder='Repeat a password'
                    {...register('repeatPassword', { validate: () =>  password === passwordRepeat ? undefined : 'Password are not matching'})}
                    isError={!!errors?.repeatPassword}
                />
                {errors?.repeatPassword && <ErrorMessage><Txt h5>{errors.repeatPassword?.message}</Txt></ErrorMessage>}
            </FormControl>
            <ButtonContainer>
                <Button
                    type="submit"
                    primary
                    isDisabled={!!(errors.password)}
                >
                    Save
                </Button>
            </ButtonContainer>
        </CreatePasswordStyle>
  )
}
