import { styled } from '../../../styles'
import { PageLayout } from '../../UIkit/PageLayout'
import Tabs from './Tabs'
import { Navigate, Outlet, RouteObject } from 'react-router'
import NftSection from './NftSection'
import CollectionSection from './CollectionSection'
import CreatorSection from './CreatorSection'
import NamespaceSection from './NamespaceSection'

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export const marketRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'nfts'} />
  },
  {
    path: 'nfts',
    element: <NftSection />
  },
  {
    path: 'collections',
    element: <CollectionSection />
  },
  {
    path: 'creators',
    element: <CreatorSection />
  },
  {
    path: 'namespaces',
    element: <NamespaceSection />
  }
]

export default function MarketPage() {
  return (
    <PageLayout>
      <TabsContainer>
        <Tabs />
      </TabsContainer>
      <Outlet />
    </PageLayout>
  )
}
