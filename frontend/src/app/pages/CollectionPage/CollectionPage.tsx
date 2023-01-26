import { Outlet, useLocation, useParams } from 'react-router'
import { styled } from '../../../styles'
import Badge from '../../components/Badge/Badge'
import { textVariant, Container, NavLink, Link } from '../../UIkit'
import Tabs from '../../UIkit/Tabs/Tabs'
import bg from './img/Gradient.jpg'
import { observer } from 'mobx-react-lite'
import { useCollectionTokenListStore } from '../../hooks/useCollectionTokenListStore'
import { Params } from '../../utils/router/Params'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { gradientPlaceholderImg } from '../../components/Placeholder/GradientPlaceholder'

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
  border: '8px solid $white',
  objectFit: 'cover'
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

const StyledContainer = styled(Container, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@lg': {
    flexDirection: 'column',
    paddingBottom: '$4'
  }
})

const CollectionPage = observer(() => {
  const { collectionAddress } = useParams<Params>()
  const { data: collectionAndNfts } =
    useCollectionTokenListStore(collectionAddress)

  const { pathname: currentPath } = useLocation()

  return (
    <>
      <GrayOverlay>
        <Background src={bg} />
        {collectionAndNfts && (
          <StyledContainer>
            <Profile>
              <ProfileHeader>
                <ProfileImage
                  src={
                    collectionAndNfts.collection?.image
                      ? getHttpLinkFromIpfsString(
                        collectionAndNfts.collection?.image ?? ''
                      )
                      : gradientPlaceholderImg
                  }
                />
                <ProfileName>{collectionAndNfts.collection?.name}</ProfileName>
              </ProfileHeader>

              <Badges>
                <NavLink
                  to={
                    collectionAndNfts.collection?.owner
                      ? `/profile/${collectionAndNfts.collection.owner}`
                      : currentPath
                  }
                >
                  <Badge
                    content={{
                      title: 'Creator',
                      value: reduceAddress(
                        collectionAndNfts.collection?.owner ?? ''
                      )
                    }}
                    image={{
                      url: getProfileImageUrl(
                        collectionAndNfts.collection?.owner ?? ''
                      ),
                      borderRadius: 'circle'
                    }}
                  />
                </NavLink>

                {collectionAndNfts.collection?.address && (
                  <Link
                    href={`https://mumbai.polygonscan.com/token/${collectionAndNfts.collection?.address}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Badge content={{ title: 'Etherscan.io', value: 'VRG' }} />
                  </Link>
                )}
              </Badges>

              <ProfileDescription>
                {collectionAndNfts.collection?.description}
              </ProfileDescription>
            </Profile>
          </StyledContainer>

        )}
        <Inventory>
          <TabsContainer>
            <Tabs
              tabs={[
                {
                  name: 'NFTs',
                  url: 'nfts',
                  amount: collectionAndNfts?.tokens?.length ?? 0
                }
              ]}
            />
          </TabsContainer>
          <Outlet />
        </Inventory>
      </GrayOverlay>
    </>
  )
})

export default CollectionPage
