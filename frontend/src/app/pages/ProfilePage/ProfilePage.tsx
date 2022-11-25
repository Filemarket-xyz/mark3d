import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useOutletContext, useParams } from 'react-router-dom'
import { styled } from '../../../styles'
import { Token } from '../../../swagger/Api'
import { useCollectionAndTokenListStore } from '../../hooks'
import { textVariant, Container } from '../../UIkit'
import Tabs from '../../UIkit/Tabs/Tabs'
import bg from './img/Gradient.jpg'

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

const ProfileCredentials = styled('div', {
  display: 'flex',
  gap: '$2',
  marginBottom: '$4'
})

const CredentialsItem = styled('div', {
  height: '$4',
  padding: '8px 12px',
  fontSize: '$primary3',
  color: '$blue500',
  fontWeight: 600,
  lineHeight: '$primary1',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '$white',
  borderRadius: '$2'
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

const ProfilePage = observer(() => {
  const { profileId } = useParams<{ profileId: `0x${string}` }>()

  const { tokens, isLoaded, isLoading } =
    useCollectionAndTokenListStore(profileId)

  const [nfts, setNfts] = useState<Token[]>([])

  useEffect(() => {
    if (!isLoaded) return
    setNfts(toJS(tokens))
  }, [isLoaded])

  return (
    <>
      <GrayOverlay>
        <Background src={bg} />

        <Container>
          <Profile>
            <ProfileHeader>
              <ProfileImage src={bg} />
              <ProfileName>UnderKong</ProfileName>
            </ProfileHeader>

            <ProfileCredentials>
              <CredentialsItem>something</CredentialsItem>
              <CredentialsItem>twitter</CredentialsItem>
            </ProfileCredentials>

            <ProfileDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sodales
              id in facilisis donec. Aliquam sed volutpat posuere pharetra
              viverra lacinia odio amet suscipit. A, quis arcu amet, nunc odio
              suspendisse cursus mauris. Aliquam dictum in ornare odio eget ut
              eleifend etiam.
            </ProfileDescription>
          </Profile>
        </Container>

        <Inventory>
          <TabsContainer>
            <Tabs
              tabs={[
                {
                  name: 'Owned',
                  url: 'owned',
                  amount: nfts.length
                },
                {
                  name: 'Created',
                  url: 'created',
                  amount: 2
                },
                {
                  name: 'Namespaces',
                  url: 'namespaces',
                  amount: 3
                },
                {
                  name: 'Collections',
                  url: 'collections',
                  amount: 1
                },
                {
                  name: 'History',
                  url: 'history'
                }
              ]}
            />
          </TabsContainer>
          <Outlet context={{ nfts, isLoaded, isLoading }} />
        </Inventory>
      </GrayOverlay>
    </>
  )
})

interface ContextType {
  nfts: Token[]
  isLoading: boolean
  isLoaded: boolean
}

export const useNfts = () => {
  return useOutletContext<ContextType>()
}

export default ProfilePage
