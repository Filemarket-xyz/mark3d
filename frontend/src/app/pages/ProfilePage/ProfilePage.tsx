import React from 'react'
import { styled } from '../../../styles'
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
  marginBottom: '$4'
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
  paddingBottom: '$3'
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
  borderTopRightRadius: 64
})

export default function ProfilePage() {
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
            <Tabs />
        </Inventory>
      </GrayOverlay>
    </>
  )
}
