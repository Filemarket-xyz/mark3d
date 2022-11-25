import { observer } from 'mobx-react-lite'
import { styled } from '../../../../styles'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard from '../../../components/MarketCard/NFTCard'
import { useCollectionTokenListStore } from '../../../hooks/useCollectionTokenListStore'

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

const NftSection = observer(() => {
  const {
    isLoading,
    nftCards
  } = useCollectionTokenListStore()

  return (
    <CardsContainer>
      {isLoading ? (
        <CardsPlaceholder cardsAmount={5} />
      ) : (
        nftCards.map((card, index) => <NFTCard {...card} key={index} />)
      )}
    </CardsContainer>
  )
})

export default NftSection
