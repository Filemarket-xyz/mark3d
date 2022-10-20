import { createBrowserRouter } from 'react-router-dom'
import ExplorerPage from './ExplorerPage/ExplorerPage'

export const router = createBrowserRouter([
  {
    path: '/explorer',
    element: <ExplorerPage/>
  }
])
