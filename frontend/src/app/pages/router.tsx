import { createBrowserRouter, RouteObject } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'
import { AppLayout } from '../components/App'

const routes: RouteObject[] = [
  {
    path: 'explorer',
    element: <ExplorerPage />
  }
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routes
  }
])
