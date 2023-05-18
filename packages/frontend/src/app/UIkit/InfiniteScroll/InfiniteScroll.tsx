
import { CSS } from '@stitches/react'
import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import useVirtual, { type Item } from 'react-cool-virtual'

import { Loading } from '../Loading'
import { StyledInnerDiv } from './InfiniteScroll.styles'

interface InfiniteScrollProps {
  currentItemCount: number
  render: (item: Item) => ReactNode
  fetchMore: () => void
  hasMore: boolean
  isLoading: boolean
  listCss?: CSS
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  currentItemCount,
  render,
  hasMore,
  isLoading,
  fetchMore,
  listCss
}) => {
  const loadingTriggerRef = useRef<HTMLDivElement>(null)
  const { outerRef, innerRef, items } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: currentItemCount
  })

  const observerCallback = useCallback<IntersectionObserverCallback>(([target]) => {
    if (!target.isIntersecting || isLoading) return

    fetchMore()
  }, [isLoading])

  const observer = useMemo(() => new IntersectionObserver(observerCallback, { threshold: 0 }), [observerCallback])

  useEffect(() => {
    if (loadingTriggerRef.current) {
      observer.observe(loadingTriggerRef.current)
    }

    return () => observer.disconnect()
  }, [loadingTriggerRef.current, observer])

  return (
    <div ref={outerRef}>
      <StyledInnerDiv
        ref={innerRef}
        css={{
          ...listCss,
          height: 'auto !important'
        }}
      >
        {items.map(render)}
      </StyledInnerDiv>
      {!!currentItemCount && hasMore && (
        <Loading isLoading={isLoading}>
          <div ref={loadingTriggerRef} />
        </Loading>
      )}
    </div>
  )
}
