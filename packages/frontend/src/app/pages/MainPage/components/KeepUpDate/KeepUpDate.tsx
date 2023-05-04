import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { styled } from '../../../../../styles'
import { Button, Txt } from '../../../../UIkit'
import { Input } from '../../../../UIkit/Form/Input'
import { Header, InfoBlockCard } from '../../helper/InfoBlockCard/InfoBlockCard'

const KeepUpDateStyle = styled('div', {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: '58% auto 38%',
  justifyContent: 'space-between'
})

const Line = styled('div', {
  background: '#F4F4F4',
  height: '100%',
  width: '2px'
})

const CommunityBlock = styled('div', {
  width: '38%',
  display: 'flex',
  flexWrap: 'wrap'
})

const InputForm = styled('form', {
  display: 'flex',
  width: '100%',
  gap: '8px',
  justifyContent: 'space-between'
})

interface SubscribeForm {
  email: string
}

const KeepUpDate = () => {
  const {
    register,
    handleSubmit
  } = useForm<SubscribeForm>({})

  const subscribe = ({ email }: SubscribeForm) => {
    console.log(email)
  }

  const onSubmit: SubmitHandler<SubscribeForm> = (data) => {
    subscribe(data)
  }

  return (
    <InfoBlockCard>
      <KeepUpDateStyle>
        <div>
          <Header style={{ paddingBottom: '16px' }}>Keep up to date</Header>
          <Txt primary1 style={{ fontWeight: '400' }}>Subscribe to our newsletter to remain informed about our latest feature updates, NFT launches, and guidance on how to effectively explore FileMarket.</Txt>
          <InputForm onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '24px' }}>
            <Input
              placeholder='Enter your email'
              {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
            />
            <Button primary>Subscribe</Button>
          </InputForm>
        </div>
      <Line />
        <div>
        <Header style={{ paddingBottom: '16px' }}>Join the community</Header>
        <CommunityBlock></CommunityBlock>
        </div>
      </KeepUpDateStyle>
    </InfoBlockCard>
  )
}

export default KeepUpDate
