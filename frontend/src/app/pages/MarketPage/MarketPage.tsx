import React from 'react'
import { styled } from '../../../styles'
import CollectionCard from '../../components/MarketCard/CollectionCard'
import NFTCard from '../../components/MarketCard/NFTCard'
import { PageLayout } from '../../UIkit/PageLayout'
import cardImg from './img/cardImg.jpg'
import userimg from './img/userImg.jpg'
import Tabs from './Tabs'
import collectionIcon from './img/icon.jpg'
import CreatorCard from '../../components/MarketCard/CreatorCard'
import bg from './img/bg.jpg'
import largerUserImg from './img/largerUserImg.jpg'
import NamespaceCard from '../../components/MarketCard/NamespaceCard'
import namespace from './img/namespace.jpg'

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export default function MarketPage() {
  return (
    <PageLayout>
      <TabsContainer>
        <Tabs />
      </TabsContainer>
      <NFTCard
        collection='VR Glasses collection'
        imageURL={cardImg}
        price={0.66666}
        title='Ultra mega super VR Glasses... '
        user={{ img: userimg, username: 'UnderKong' }}
      ></NFTCard>
      <CollectionCard
        description={
          <>
            Mark3d NFT collection for
            <br /> 3D Internet and virtual worlds
          </>
        }
        iconURL={collectionIcon}
        imageUrl={cardImg}
      />
      <CreatorCard
        bgImageUrl={bg}
        description={
          <>
            UnderKong.eth Meta Jedi / Council of MetaLegends / Founder of
            DAOart. UnderKong.eth Meta Jedi / Council of MetaLegends / Founder
            of DAOart.
          </>
        }
        user={{
          imageUrl: largerUserImg,
          name: 'UnderKong',
          social: '@UnderKong`s twitter'
        }}
      />
      <NamespaceCard
        imageURL={namespace}
        price={0.6665}
        title={'Mark3dNamespace.3d'}
        user={{ img: userimg, username: 'UnderKong' }}
      />
    </PageLayout>
  )
}
