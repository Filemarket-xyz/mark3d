import { styled } from '../../../styles'
import { PageLayout } from '../../UIkit/PageLayout'
import Tabs, { TabsProps } from '../../UIkit/Tabs/Tabs'
import { Outlet } from 'react-router'

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

const tabs: Pick<TabsProps, 'tabs'> = {
  tabs: [
    {
      name: 'NFTs',
      url: '/market/nfts',
      amount: 123456
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
  ]
}

export default function MarketPage() {
  return (
    <PageLayout>
      <TabsContainer>
        <Tabs {...tabs} />
      </TabsContainer>
      <Outlet />
    </PageLayout>
  )
}
