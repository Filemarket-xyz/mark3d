import { styled } from '../../../styles'
import { PageLayout } from '../../UIkit/PageLayout'
import Tabs from '../../UIkit/Tabs/Tabs'
import { Outlet } from 'react-router'
import { observer } from 'mobx-react-lite'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import { toJS } from 'mobx'

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export const MarketPage = observer(() => {
  const { data: nfts } = useOpenOrderListStore()

  return (
    <PageLayout>
      <TabsContainer>
        <Tabs
          tabs={[
            {
              name: 'NFTs',
              url: '/market/nfts',
              amount: toJS(nfts).length
            },
            {
              name: 'Collections',
              url: '/market/collections',
              amount: 1234
            },
            {
              name: 'Creators',
              url: '/market/creators',
              amount: 123
            },
            {
              name: 'Namespaces',
              url: '/market/namespaces',
              amount: 123
            }
          ]}
        />
      </TabsContainer>
      <Outlet />
    </PageLayout>
  )
})

export default MarketPage
