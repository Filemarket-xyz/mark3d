import React, { ComponentProps } from 'react'
import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'

const Wrapper = styled('div', {
  backgroundColor: '$white',
  display: 'flex',
  gap: '$2',
  padding: '$2 $3',
  alignItems: 'center',
  borderRadius: '$3',
  width: 'max-content'
})

const Title = styled('p', {
  color: '$gray500',
  ...textVariant('primary3').true
})

const Value = styled('p', {
  ...textVariant('primary1').true,
  color: '$blue500'
})

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1'
})

const Image = styled('img', {
  width: 48,
  height: 48,
  borderRadius: '50%',
  border: '2px solid $blue500'
})

export interface BadgeProps {
  imgUrl?: string
  content: {
    title?: string
    value: string
  }
  wrapperProps?: ComponentProps<typeof Wrapper>
  valueStyles?: ComponentProps<typeof Value>
}

export default function Badge(props: BadgeProps) {
  return (
    <Wrapper {...props.wrapperProps}>
      {props.imgUrl && <Image src={props.imgUrl} />}
      <Content>
        {props.content.title && <Title>{props.content.title}</Title>}
        <Value css={props.valueStyles?.css}>{props.content.value}</Value>
      </Content>
    </Wrapper>
  )
}
