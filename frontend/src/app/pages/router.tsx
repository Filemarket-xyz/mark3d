import { createBrowserRouter, RouteObject } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'
import { AppLayout } from '../components/App'
import MainPage from './MainPage/MainPage'
import MarketPage, { marketRoutes } from './MarketPage/MarketPage'

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
  }
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routes
  }
])
