import React from 'react'

import { styled } from '../../../../../styles'
import { Card, Cards, Text } from '../../../../components/App/Footer/section/Top/TopSection'
import { Txt } from '../../../../UIkit'
import { Header, InfoBlockCard } from '../../helper/InfoBlockCard/InfoBlockCard'
import EmailForm from '../EmailForm/EmailForm'

const KeepUpDateStyle = styled('div', {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: '58% auto 38%',
  justifyContent: 'space-between',
  '@md': {
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'inherit',
    gap: '12px',
  },
})

const Line = styled('div', {
  background: '#F4F4F4',
  height: '100%',
  width: '2px',
})

const CommunityBlock = styled('div', {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

const KeepUpDate = () => {
  return (
    <InfoBlockCard>
      <KeepUpDateStyle>
        <div>
          <Header style={{ paddingBottom: '16px' }}>Keep up to date</Header>
          <Txt primary1 style={{ fontWeight: '400' }}>Subscribe to our newsletter to remain informed about our latest feature updates, NFT launches, and guidance on how to effectively explore FileMarket.</Txt>
          <EmailForm />
        </div>
        <Line />
        <div>
          <Header style={{ paddingBottom: '16px' }}>Join the community</Header>
          <CommunityBlock>
            {Cards.map((item, index) => (
              <Card
                key={index}
                white
                href={item.url}
                target={'_blank'}
              >
                <img src={item.blackImg} />
                <Text black>{item.text}</Text>
              </Card>
            ))}
          </CommunityBlock>
        </div>
      </KeepUpDateStyle>
    </InfoBlockCard>
  )
}

export default KeepUpDate
