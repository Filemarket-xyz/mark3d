import { Skeleton } from '@mui/material'
import React, { PropsWithChildren } from 'react'

interface CardsSkeletonLoadingProps extends PropsWithChildren {
  count: number
  isLoading: boolean
}

export const CardsSkeletonLoading: React.FC<CardsSkeletonLoadingProps> = ({ count, isLoading, children }) => {
  if (isLoading) {
    return (
      <>
        {new Array<number>(count).fill(0).map((_, i) => (
          <Skeleton
            key={i}
            sx={{ borderRadius: '16px' }}
            variant='rectangular'
            width={259}
            height={324}
          />
        ))}
      </>
    )
  }

  return <>{children}</>
}
