import React from 'react'

import { styled } from '../../../../styles'
import { Txt } from '../../../UIkit'
import CardPartner from '../components/Card/CardPartner'
import { OurPartnersOptions } from '../helper/CardPartners/data'
import { PoweredByContainer } from './PoweredBy'

const OurPartnersContainer = styled(PoweredByContainer, {
  paddingTB: '160px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px'
})

const OurPartnersStyle = styled('div', {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap'
})

const OurPartners = () => {
  return (
    <OurPartnersContainer>
      <Txt h1 style={{ fontSize: '56px', lineHeight: '56px' } }>Our Partners</Txt>
      <OurPartnersStyle>
        {OurPartnersOptions.map((item, index) => <CardPartner img={item.img} url={item.url} partners={true} key={index} />)}
      </OurPartnersStyle>
    </OurPartnersContainer>
  )
}

export default OurPartners
