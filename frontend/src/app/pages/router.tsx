import { createBrowserRouter, RouteObject } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'
import { AppLayout } from '../components/App'
import MainPage from './MainPage/MainPage'

const routes: RouteObject[] = [
  {
    path: 'explorer',
    element: <ExplorerPage/>
  },
  {
    path: '/',
    element: <MainPage/>
  }
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout/>,
    children: routes
  }
])
