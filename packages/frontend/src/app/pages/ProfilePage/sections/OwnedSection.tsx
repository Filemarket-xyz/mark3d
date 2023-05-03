import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import NFTCard from '../../../components/MarketCard/NFTCard'
import Plug from '../../../components/Plug/Plug'
import { useCollectionAndTokenListStore } from '../../../hooks'
import { CardsPlaceholder, NavButton, textVariant } from '../../../UIkit'
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
          <Plug type={'NFT'} />
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

    return <Plug type={'NFT'} />
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
