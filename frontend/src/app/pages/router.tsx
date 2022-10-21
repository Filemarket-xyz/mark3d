import { createBrowserRouter, RouteObject, Outlet } from 'react-router-dom'
import { AppLayout } from '../components/Outlet/AppLayout'
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
      <AppLayout>
        {/* TODO HEADER, FOOTER, ETC. */}
        <Outlet/>
      </AppLayout>
    </>),
    children: routes
  }
])
