import { Navigate, RouteObject } from 'react-router-dom'
import CollectionSection from '../MarketPage/CollectionSection'
import NamespaceSection from '../MarketPage/NamespaceSection'
import NftSection from '../MarketPage/NftSection'

export const profileRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'owned'} />
  },
  {
    path: 'owned',
    element: <NftSection />
  },
  {
    path: 'created',
    element: <NftSection />
  },
  {
    path: 'namespaces',
    element: <NamespaceSection />
  },
  {
    path: 'collections',
    element: <CollectionSection />
  }
]
