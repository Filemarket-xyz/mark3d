import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'
import { AppLayout } from '../components/App'
import MainPage from './MainPage/MainPage'
import MarketPage from './MarketPage/MarketPage'
import { createRoutes } from './CreatePage/routes'
import { marketRoutes } from './MarketPage/routes'
import ProfilePage from './ProfilePage/ProfilePage'
import { profileRoutes } from './ProfilePage/routes'
import NFTPage from './NFTPage/NFTPage'
import CollectionPage from './CollectionPage/CollectionPage'
import { collectionPageRoutes } from './CollectionPage/routes'
import { Params } from '../utils/router/Params'

const routes: RouteObject[] = [
  {
    path: 'explorer',
    element: <ExplorerPage />
  },
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: 'market',
    element: <MarketPage />,
    children: marketRoutes
  },
  {
    path: 'create',
    children: createRoutes
  },
  {
    path: 'profile/:id',
    element: <ProfilePage />,
    children: profileRoutes
  },
  {
    path: 'collection/:id',
    element: <CollectionPage />,
    children: collectionPageRoutes
  },
  {
    path: `collection/:${Params.collectionAddress}/:${Params.tokenId}`,
    element: <NFTPage />
  },
  {
    path: '*',
    element: <Navigate to={''} />
  }
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routes
  }
])
