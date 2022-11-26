import { observer } from 'mobx-react-lite'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard from '../../../components/MarketCard/NFTCard'
import { useCollectionAndTokenListStore } from '../../../hooks'
import { CardsContainer } from '../../MarketPage/NftSection'

export const OwnedSection = observer(() => {
  const { isLoading, nftCards } = useCollectionAndTokenListStore()

  return (
    <CardsContainer>
      {isLoading ? (
        <CardsPlaceholder cardsAmount={5} />
      ) : (
        nftCards.map((card, i) => <NFTCard {...card} key={i} />)
      )}
    </CardsContainer>
  )
})

export default OwnedSection
