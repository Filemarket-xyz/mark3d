import { styled } from '../../../styles'
import { PageLayout } from '../../UIkit'
import Tabs from '../../UIkit/Tabs/Tabs'
import { Outlet } from 'react-router'
import { observer } from 'mobx-react-lite'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import FakeMint from "../../components/FakeMint/FakeMint";

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export const MarketPage = observer(() => {
  const { nftCards } = useOpenOrderListStore()

  return (
      <>
      <FakeMint/>
    <PageLayout nonePaddingTop={true}>
      <TabsContainer>
        <Tabs
          tabs={[
            {
              name: 'NFTs',
              url: '/market/nfts',
              amount: nftCards?.length
            },
            {
              name: 'Collections',
              url: '/market/collections'
            },
            {
              name: 'Creators',
              url: '/market/creators'
            },
            {
              name: 'Namespaces',
              url: '/market/namespaces'
            }
          ]}
        />
      </TabsContainer>
      <Outlet />
    </PageLayout>
      </>
  )
})

export default MarketPage
