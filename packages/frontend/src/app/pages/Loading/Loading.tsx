import React from 'react'

import LoadingImg from '../../../assets/img/LoadingIcon.svg'
import { styled } from '../../../styles'

const LoadingStyle = styled('div', {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& img': {
    transform: 'scale(0.2)',
  },
})

const Loading = () => {
  return (
    <LoadingStyle>
      <img src={LoadingImg} />
    </LoadingStyle>
  )
}

export default Loading
