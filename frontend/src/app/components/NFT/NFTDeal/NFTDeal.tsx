import Badge from '../../Badge/Badge'
import creator from '../../../pages/NFTPage/img/creatorImg.jpg'
import { Button } from '../../../UIkit'
import React, { FC } from 'react'
import { styled } from '../../../../styles'
import { observer } from 'mobx-react-lite'
import { Transfer } from '../../../../swagger/Api'

export interface NFTDealProps {
  transfer?: Transfer
  collectionAddress?: string
  tokenId?: string
}

const DealContainer = styled('div', {
  borderRadius: '$4',
  border: '2px solid transparent',
  background:
    'linear-gradient($gray100 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
  padding: '$3'
})

const DealContainerInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3',
  gap: '$3',
  '@sm': {
    flexDirection: 'column'
  }
})

export const NFTDeal: FC<NFTDealProps> = observer(() => {
  return (
    <DealContainer>
      <DealContainerInfo>
        <Badge
          wrapperProps={{ css: { flexShrink: 0 } }}
          imgUrl={creator}
          content={{ title: 'Creator', value: 'Underkong' }}
        />
      </DealContainerInfo>
      <Button primary css={{ width: '100%' }}>
        Buy now
      </Button>
    </DealContainer>
  )
})
