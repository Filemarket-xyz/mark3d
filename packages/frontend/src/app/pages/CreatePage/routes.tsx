import { Navigate, RouteObject } from 'react-router-dom'
import CreateCollectionPage from './CreateCollectionPage'
import CreateNFTPage from './CreateNFTPage'

export const createRoutes: RouteObject[] = [
  {
    path: 'nft',
    element: <CreateNFTPage />
  },
  {
    path: 'collection',
    element: <CreateCollectionPage />
  },
  {
    path: '',
    element: <Navigate to={'collection'} />
  }
]
