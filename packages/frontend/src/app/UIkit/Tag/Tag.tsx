import React, { FC, ReactNode } from 'react'

import deleteImg from '../../../assets/img/closeButtonIcon.svg'
import { styled } from '../../../styles'
import { textVariant } from '../Txt'

export const BlueText = styled('h5', {
  ...textVariant('primary2').true,
  color: '$blue500',
})

export const TagStyle = styled(BlueText, {
  padding: '6px 16px',
  background: '#FFFFFF',
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  borderRadius: '20px',
  display: 'flex',
  gap: '10px',
  border: '1px solid $gray300',
  '& img': {
    cursor: 'pointer',
  },
})

export interface TagOptions {
  isCanDelete?: boolean
  onDelete?: (value?: string) => void
}

interface TagProps {
  tagOptions?: TagOptions
  children?: ReactNode
  value?: string
}

const Tag: FC<TagProps> = ({ tagOptions, children, value }) => {
  return (
    <TagStyle>
      {children}
      {tagOptions?.isCanDelete && <img src={deleteImg} onClick={() => { tagOptions?.onDelete?.(value) }} />}
    </TagStyle>
  )
}

export default Tag
