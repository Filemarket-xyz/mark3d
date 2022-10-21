import { ReactNode } from 'react'

export interface Path {
  to: string
  label?: ReactNode
}

export const paths: Path[] = [
  {
    to: '/explorer',
    label: 'Explorer'
  }
]
