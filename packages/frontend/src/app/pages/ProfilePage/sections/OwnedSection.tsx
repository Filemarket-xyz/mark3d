import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { styled } from '../../../../styles'
import { CardsPlaceholder, NavButton, textVariant } from '../../../UIkit'
import NFTCard from '../../../components/MarketCard/NFTCard'
import { useCollectionAndTokenListStore } from '../../../hooks'
import { Params } from '../../../utils/router/Params'
import { CardsContainer } from '../../MarketPage/NftSection'

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

export const OwnedSection = observer(() => {
  const { isLoading, nftCards } = useCollectionAndTokenListStore()
  const { profileAddress } = useParams<Params>()
  const { address: currentAddress } = useAccount()

  const generateContentIfNoCards = () => {
    if (profileAddress === currentAddress) {
      return (
        <>
          <P>There is no NFT yet, wish to add one?</P>
          <NavButton
            primary
            to={'/create/nft'}
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
      ) : nftCards.length > 0 ? (
        nftCards.map((card, i) => <NFTCard {...card} key={i} />)
      ) : (
        <NoNftContainer>{generateContentIfNoCards()}</NoNftContainer>
      )}
    </CardsContainer>
  )
})

export default OwnedSection
