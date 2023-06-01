import { observer } from 'mobx-react-lite'
import { Outlet, useLocation, useParams } from 'react-router'

import { styled } from '../../../styles'
import { mark3dConfig } from '../../config/mark3d'
import { useCollectionTokenListStore } from '../../hooks/useCollectionTokenListStore'
import { Badge, Container, gradientPlaceholderImg, Link, NavLink, Tabs, textVariant } from '../../UIkit'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { Params } from '../../utils/router'

const Background = styled('div', {
  background: '$gradients$background',
  width: '100%',
  height: 352,
})

const Profile = styled('div', {
  paddingBottom: '$4',
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
    marginBottom: '$3',
  },
})

const ProfileImage = styled('img', {
  width: 160,
  height: 160,
  borderRadius: '50%',
  border: '8px solid $white',
  objectFit: 'cover',
  background: '$gradients$main',
})

const ProfileName = styled('h2', {
  ...textVariant('h2').true,
  color: '$blue900',
  paddingBottom: '$3',
  '@sm': {
    fontSize: 'calc(5vw + 10px)',
  },
})

const Badges = styled('div', {
  display: 'flex',
  gap: '$2',
  marginBottom: '$4',
})

const GrayOverlay = styled('div', {
  backgroundColor: '$gray100',
})

const ProfileDescription = styled('p', {
  ...textVariant('body3'),
  maxWidth: 540,
  color: '$gray500',
})

const Inventory = styled(Container, {
  paddingTop: '$4',
  backgroundColor: '$white',
  borderRadius: '$6 $6 0 0',
  '@md': {
    borderRadius: '$4 $4 0 0',
  },
  boxShadow: '$footer',
  minHeight: 460, // prevent floating footer
})

const TabsContainer = styled('div', {
  marginBottom: '$4',
})

const StyledContainer = styled(Container, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@lg': {
    flexDirection: 'column',
    paddingBottom: '$4',
  },
})

const CollectionPage = observer(() => {
  const { collectionAddress } = useParams<Params>()
  const { data: collectionAndNfts } =
    useCollectionTokenListStore(collectionAddress)

  const { pathname: currentPath } = useLocation()

  return (
    <GrayOverlay>
      <Background />
      {collectionAndNfts && (
        <StyledContainer>
          <Profile>
            <ProfileHeader>
              <ProfileImage
                src={
                  collectionAndNfts.collection?.image
                    ? getHttpLinkFromIpfsString(collectionAndNfts.collection?.image ?? '')
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
                    value: reduceAddress(collectionAndNfts.collection?.owner ?? ''),
                  }}
                  image={{
                    url: getProfileImageUrl(collectionAndNfts.collection?.owner ?? ''),
                    borderRadius: 'circle',
                  }}
                />
              </NavLink>
              {collectionAndNfts.collection?.address && (
                <Link
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`${mark3dConfig.chain.blockExplorers?.default.url}` +
                      `/address/${collectionAndNfts.collection?.address}`}
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
                name: 'EFTs',
                url: 'efts',
                amount: collectionAndNfts?.total ?? 0,
              },
            ]}
          />
        </TabsContainer>
        <Outlet />
      </Inventory>
    </GrayOverlay>
  )
})

export default CollectionPage
