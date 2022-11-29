import { observer } from 'mobx-react-lite'
import { useAccount } from 'wagmi'
import { styled } from '../../../../styles'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard from '../../../components/MarketCard/NFTCard'
import { useCollectionTokenListStore } from '../../../hooks/useCollectionTokenListStore'
import { textVariant } from '../../../UIkit'
import { NavButton } from '../../../UIkit/Button/NavButton'

export const CardsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '$4',
  justifyContent: 'normal',
  '@md': {
    justifyContent: 'space-around'
  },
  '@sm': {
    justifyContent: 'center'
  },
  paddingBottom: '$3'
})

const P = styled('p', {
  color: '$gray500',
  ...textVariant('primary1').true,
  textAlign: 'center'
})

const NoNftContainer = styled('div', {
  gridColumn: '1/-1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '$3',
  width: '100%'
})

const NftSection = observer(() => {
  const {
    isLoading,
    nftCards,
    data: { collection }
  } = useCollectionTokenListStore()

  const { address: currentAddress } = useAccount()

  const generateContentIfNoCards = () => {
    if (currentAddress === collection?.owner) {
      return (
        <>
          <P>There is no NFT yet, wish to add one?</P>
          <NavButton
            primary
            to={'/create/nft'}
            state={{
              collection: {
                address: collection?.address,
                name: collection?.name
              }
            }}
            css={{ textDecoration: 'none', marginBottom: '$3' }}
          >
            Create NFT
          </NavButton>
        </>
      )
    }

    return <P>The NFT list is empty</P>
  }

  return (
    <CardsContainer>
      {isLoading ? (
        <CardsPlaceholder cardsAmount={5} />
      ) : nftCards.length ? (
        nftCards.map((card, index) => <NFTCard {...card} key={index} />)
      ) : (
        <NoNftContainer>{generateContentIfNoCards()}</NoNftContainer>
      )}
    </CardsContainer>
  )
})

export default NftSection
