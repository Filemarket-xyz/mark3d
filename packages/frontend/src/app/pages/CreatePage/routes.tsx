import { Navigate, RouteObject } from 'react-router-dom'

import CreateCollectionPage from './CreateCollectionPage'
import { CreateNFTPage } from './CreateNFTPage'

export const createRoutes: RouteObject[] = [
  {
    path: 'eft',
    element: <CreateNFTPage />,
  },
  {
    path: 'collection',
    element: <CreateCollectionPage />,
  },
  {
    path: '',
    element: <Navigate to={'eft'} />,
  },
]
