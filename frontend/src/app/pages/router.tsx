import { createBrowserRouter, RouteObject } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'
import { AppLayout } from '../components/App'
import MainPage from './MainPage/MainPage'
import MarketPage, { marketRoutes } from './MarketPage/MarketPage'
import CreateCollectionPage from './CreateCollectionPage/CreateNFT'

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
        element: <CreateCollectionPage />
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
