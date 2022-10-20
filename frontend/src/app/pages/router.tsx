import { createBrowserRouter, RouteObject, Outlet as RouterOutlet } from 'react-router-dom'
import { Outlet } from '../components/Outlet/Outlet'
import ExplorerPage from './ExplorerPage/ExplorerPage'

const routes: RouteObject[] = [
  {
    path: 'explorer',
    element: <ExplorerPage/>
  }
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
    <>
      <Outlet>
        <RouterOutlet/>
      </Outlet>
    </>),
    children: routes
  }
])
