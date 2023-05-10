import React from 'react'

import { styled } from '../../../../styles'
import { Container, Txt } from '../../../UIkit'
import CardPartner from '../components/Card/CardPartner'
import { PoweredByOptions } from '../helper/CardPartners/data'

const PoweredByContainer = styled(Container, {
  paddingTB: '160px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px'
})

const PoweredByStyle = styled('div', {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap'
})

const PoweredBy = () => {
  return (
    <PoweredByContainer>
      <Txt h1 style={{ fontSize: '56px', lineHeight: '56px' } }>Powered by</Txt>
      <PoweredByStyle>
        {PoweredByOptions.map((item, index) => <CardPartner img={item.img} url={item.url} key={index} />)}
      </PoweredByStyle>
    </PoweredByContainer>
  )
}

export default PoweredBy
