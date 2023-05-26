
import { CSS } from '@stitches/react'
import React, { ReactNode, useCallback, useMemo, useRef } from 'react'
import useVirtual, { type Item } from 'react-cool-virtual'

import { useAfterDidMountEffect } from '../../hooks/useDidMountEffect'
import { Loading } from '../Loading'
import { StyledInnerDiv, StyledTrigger } from './InfiniteScroll.styles'

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
  listCss,
}) => {
  const loadingTriggerRef = useRef<HTMLSpanElement>(null)
  const { outerRef, innerRef, items } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: currentItemCount,
  })

  const observerCallback = useCallback<IntersectionObserverCallback>(([target]) => {
    if (!target.isIntersecting || isLoading) return

    fetchMore()
  }, [isLoading])

  const observer = useMemo(() => new IntersectionObserver(observerCallback, { threshold: 0 }), [observerCallback])

  useAfterDidMountEffect(() => {
    if (!loadingTriggerRef.current) return

    observer.observe(loadingTriggerRef.current)

    return () => observer.disconnect()
  }, [loadingTriggerRef.current, observer])

  return (
    <div ref={outerRef}>
      <StyledInnerDiv
        ref={innerRef}
        css={{
          ...listCss,
          position: 'relative',
          height: 'auto !important',
        }}
      >
        {/* items.length may be incorrect at first render if there was a larger value at the previous render */}
        {items.length <= currentItemCount && items.map(render)}
        {!!items.length && hasMore && (
          <Loading isLoading={isLoading}>
            <StyledTrigger ref={loadingTriggerRef} />
          </Loading>
        )}
      </StyledInnerDiv>
    </div>
  )
}
