import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router'

import { styled } from '../../../styles'
import FakeMint from '../../components/FakeMint/FakeMint'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import { PageLayout } from '../../UIkit'
import Tabs from '../../UIkit/Tabs/Tabs'

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export const MarketPage = observer(() => {
  const { nftCards } = useOpenOrderListStore()

  return (
      <>
      <FakeMint />
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
