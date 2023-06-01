import { Navigate, RouteObject } from 'react-router-dom'

import CreatorSection from '../MarketPage/CreatorSection'
import NftSection from './sections/NftSection'

export const collectionPageRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'efts'} />,
  },
  {
    path: 'efts',
    element: <NftSection />,
  },
  {
    path: 'owners',
    element: <CreatorSection />,
  },
  // TODO CREATE HISTORY SECTION
  {
    path: 'History',
    element: <Navigate to={'../efts'} />,
  },
]
