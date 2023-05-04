import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router'

import { styled } from '../../../styles'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import { PageLayout } from '../../UIkit'
import Tabs from '../../UIkit/Tabs/Tabs'

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export const MarketPage = observer(() => {
  const { nftCards } = useOpenOrderListStore()

  return (
    <PageLayout>
      <TabsContainer>
        <Tabs
          tabs={[
            {
              name: 'EFTs',
              url: '/market/nfts',
              amount: nftCards?.length
            }
          ]}
        />
      </TabsContainer>
      <Outlet />
    </PageLayout>
  )
})
