import { createBrowserRouter, RouteObject } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'
import { AppLayout } from '../components/App'
import MainPage from './MainPage/MainPage'
import MarketPage from './MarketPage/MarketPage'
import { createRoutes } from './CreatePage/routes'
import { marketRoutes } from './MarketPage/routes'

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
  }
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routes
  }
])
