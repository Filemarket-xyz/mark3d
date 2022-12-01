import { Navigate, RouteObject } from 'react-router-dom'
import { HistorySection } from './sections/HistorySection'
import OwnedSection from './sections/OwnedSection'

export const profileRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'owned'} />
  },
  {
    path: 'owned',
    element: <OwnedSection />
  },
  {
    path: 'history',
    element: <HistorySection />
  }
]
