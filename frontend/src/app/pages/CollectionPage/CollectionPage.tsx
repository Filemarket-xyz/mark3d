import React, { useEffect, useState } from 'react'
import { Outlet, useOutletContext, useParams } from 'react-router'
import { styled } from '../../../styles'
import Badge from '../../components/Badge/Badge'
import { textVariant, Container } from '../../UIkit'
import Tabs from '../../UIkit/Tabs/Tabs'
import bg from './img/Gradient.jpg'
import creator from './img/creatorImg.jpg'
import { observer } from 'mobx-react-lite'
import { useCollectionTokenListStore } from '../../hooks/useCollectionTokenListStore'
import { toJS } from 'mobx'
import { Token } from '../../../swagger/Api'

const Background = styled('img', {
  width: '100%',
  height: 352
})

const Profile = styled('div', {
  paddingBottom: '$4'
})

const ProfileHeader = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '$3',
  marginTop: -80,
  marginBottom: '$4',
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '$3'
  }
})

const ProfileImage = styled('img', {
  width: 160,
  height: 160,
  borderRadius: '50%',
  border: '8px solid $white'
})

const ProfileName = styled('h2', {
  ...textVariant('h2').true,
  color: '$blue900',
  paddingBottom: '$3',
  '@sm': {
    fontSize: 'calc(5vw + 10px)'
  }
})

const Badges = styled('div', {
  display: 'flex',
  gap: '$2',
  marginBottom: '$4'
})

const GrayOverlay = styled('div', {
  backgroundColor: '$gray100'
})

const ProfileDescription = styled('p', {
  ...textVariant('body3'),
  maxWidth: 540,
  color: '$gray500'
})

const Inventory = styled(Container, {
  paddingTop: '$4',
  backgroundColor: '$white',
  borderTopLeftRadius: 64,
  borderTopRightRadius: 64,
  '@md': {
    borderTopLeftRadius: '$4',
    borderTopRightRadius: '$4'
  }
})

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

const CollectionData = styled('div', {
  display: 'flex',
  gap: '$4',
  height: 'max-content',
  padding: '$4',
  borderRadius: '$4',
  border: '2px solid transparent',
  background:
    'linear-gradient($gray100 0 0) padding-box, linear-gradient(to right, #00DCFF25, #E14BEC25) border-box'
})

const CollectionDataItem = styled('div', {
  display: 'flex',
  flexDirection: 'column'
})

const ItemTitle = styled('span', {
  ...textVariant('primary1').true,
  marginBottom: '$1'
})

const ItemValue = styled('span', {
  ...textVariant('h3').true,
  fontWeight: 700,
  '@sm': {
    fontSize: '$h5'
  },
  color: '$blue900'
})

const StyledContainer = styled(Container, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@lg': {
    flexDirection: 'column',
    paddingBottom: '$4'
  }
})

interface ContextType { nfts: Token[], isLoading: boolean }

const CollectionPage = observer(() => {
  const { collectionId } = useParams<{ collectionId: string }>()
  const { data, isLoaded, isLoading } = useCollectionTokenListStore(collectionId)

  const [nfts, setNfts] = useState<Token[]>([])

  useEffect(() => {
    if (!isLoaded) return
    setNfts(toJS(data))
  }, [isLoaded])

  return (
    <>
      <GrayOverlay>
        <Background src={bg} />

        <StyledContainer>
          <Profile>
            <ProfileHeader>
              <ProfileImage src={bg} />
              <ProfileName>VR Glasses</ProfileName>
            </ProfileHeader>

            <Badges>
              <Badge
                content={{ title: 'Creator', value: 'Underkong' }}
                imgUrl={creator}
              />
              <Badge content={{ title: 'Etherscan.io', value: 'VRG' }} />
            </Badges>

            <ProfileDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sodales
              id in facilisis donec. Aliquam sed volutpat posuere pharetra
              viverra lacinia odio amet suscipit. A, quis arcu amet, nunc odio
              suspendisse cursus mauris. Aliquam dictum in ornare odio eget ut
              eleifend etiam.
            </ProfileDescription>
          </Profile>
          <CollectionData>
            <CollectionDataItem>
              <ItemTitle>Volume</ItemTitle>
              <ItemValue>110 ETH</ItemValue>
            </CollectionDataItem>
            <CollectionDataItem>
              <ItemTitle>Floor price</ItemTitle>
              <ItemValue>3.05 ETH</ItemValue>
            </CollectionDataItem>
          </CollectionData>
        </StyledContainer>

        <Inventory>
          <TabsContainer>
            <Tabs
              tabs={[
                {
                  name: 'NFTs',
                  url: 'nfts',
                  amount: nfts.length
                },
                {
                  name: 'Owners',
                  url: 'owners',
                  amount: 2
                },
                {
                  name: 'History',
                  url: 'history',
                  amount: 3
                }
              ]}
            />
          </TabsContainer>
          <Outlet context={{ nfts, isLoading }} />
        </Inventory>
      </GrayOverlay>
    </>
  )
})

export const useNfts = () => {
  return useOutletContext<ContextType>()
}

export default CollectionPage
