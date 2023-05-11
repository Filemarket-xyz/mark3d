import React from 'react'

import { styled } from '../../../../../styles'
import { Header } from '../../helper/InfoBlockCard/InfoBlockCard'

const GetRewardsStyle = styled('div', {
  width: '100%'
})

const LinkBlocks = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between'
})

const GetRewards = () => {
  return (
    <GetRewardsStyle>
      <Header style={{ paddingBottom: '24px' }}></Header>
      <LinkBlocks />
    </GetRewardsStyle>
  )
}

export default GetRewards
