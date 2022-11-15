import { RouteObject, Navigate } from 'react-router-dom'
import CreatorSection from '../MarketPage/CreatorSection'
import NftSection from '../MarketPage/NftSection'

export const collectionPageRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'nfts'} />
  },
  {
    path: 'nfts',
    element: <NftSection />
  },
  {
    path: 'owners',
    element: <CreatorSection />
  },
  // TODO CREATE HISTORY SECTION
  {
    path: 'History',
    element: <Navigate to={'../nfts'} />
  }
]
