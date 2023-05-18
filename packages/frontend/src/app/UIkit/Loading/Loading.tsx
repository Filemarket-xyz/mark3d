import { Loading as LoadingNextUI } from '@nextui-org/react'
import React, { PropsWithChildren } from 'react'

import { Flex } from '../Flex'

interface LoadingProps extends PropsWithChildren {
  isLoading: boolean
}

export const Loading: React.FC<LoadingProps> = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <Flex
        h100
        w100
        justifyContent='center'
        css={{ minHeight: 24 }}
      >
        <LoadingNextUI type="points" size='lg' />
      </Flex>
    )
  }

  return <>{children}</>
}
