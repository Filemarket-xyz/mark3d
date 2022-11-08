import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'
import { AppLayout } from '../components/App'
import MainPage from './MainPage/MainPage'
import MarketPage, { marketRoutes } from './MarketPage/MarketPage'
import CreateNFTPage from './CreatePage/CreateNFTPage'
import CreateCollectionPage from './CreatePage/CreateCollectionPage'

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
    children: [
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
  }
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routes
  }
])
