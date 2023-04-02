import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Outlet } from 'react-router'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { styled } from '../../../styles'
import { useCollectionAndTokenListStore } from '../../hooks'
import { useTransfersHistory } from '../../hooks/useTransfersHistory'
import { useUserTransferStore } from '../../hooks/useUserTransfers'
import { textVariant, Container, gradientPlaceholderImg } from '../../UIkit'
import Tabs from '../../UIkit/Tabs/Tabs'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { Params } from '../../utils/router/Params'

const Background = styled('div', {
  background: '$gradients$background',
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
  border: '8px solid $white',
  background: '$white',
  objectFit: 'fill'
})

const ProfileName = styled('h2', {
  ...textVariant('h2').true,
  color: '$blue900',
  paddingBottom: '$3',
  '@sm': {
    fontSize: 'calc(5vw + 10px)'
  }
})

const GrayOverlay = styled('div', {
  backgroundColor: '$gray100'
})

const Inventory = styled(Container, {
  paddingTop: '$4',
  backgroundColor: '$white',
  borderRadius: '$6 $6 0 0',
  '@md': {
    borderRadius: '$4 $4 0 0'
  },
  boxShadow: '$footer',
  minHeight: 460 // prevent floating footer
})

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

const ProfilePage = observer(() => {
  const { profileAddress } = useParams<Params>()
  const { address: currentAddress } = useAccount()

  const { tableRows: table } = useTransfersHistory(profileAddress)

  const { tokens: nfts } = useCollectionAndTokenListStore(profileAddress)

  const { transferCards } = useUserTransferStore(profileAddress)

  const tabs = useMemo(() => {
    const tabs = [
      {
        name: 'Owned',
        url: 'owned',
        amount: nfts.length
      },
      {
        name: 'History',
        url: 'history',
        amount: table.length
      }
    ]

    if (currentAddress === profileAddress) {
      tabs.push({
        amount: transferCards.length,
        url: 'transfers',
        name: 'Transfers'
      })
    }

    return tabs
  }, [nfts, table, transferCards])

  return (
    <>
      <GrayOverlay>
        <Background/>

        <Container>
          <Profile>
            <ProfileHeader>
              <ProfileImage
                src={getProfileImageUrl(profileAddress ?? '')}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = gradientPlaceholderImg
                }}
              />
              <ProfileName>{reduceAddress(profileAddress ?? '')}</ProfileName>
            </ProfileHeader>
          </Profile>
        </Container>

        <Inventory>
          <TabsContainer>
            <Tabs tabs={tabs} />
          </TabsContainer>
          <Outlet />
        </Inventory>
      </GrayOverlay>
    </>
  )
})

export default ProfilePage
