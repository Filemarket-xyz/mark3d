import React, { memo, MouseEvent, useEffect, useRef } from 'react'

import { keyframes, styled } from '../../../styles'

const dripExpand = keyframes({
  '0%': {
    opacity: 0,
    transform: 'scale(0.25)',
  },
  '30%': {
    opacity: 1,
  },
  '80%': {
    opacity: 0.5,
  },
  '100%': {
    transform: 'scale(28)',
    opacity: 0,
  },
})

const DripStyled = styled('div', {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  opacity: 0.25,

  '& svg': {
    position: 'absolute',
    animation: `300ms linear ${dripExpand.name}`,
    animationFillMode: 'forwards',
    width: '1rem',
    height: '1rem',
  },
})

export interface DripProps {
  visible: boolean
  onCompleted: () => void
  color?: string
  className?: string
  top?: number // px
  left?: number // px
  onClick?: (event: MouseEvent<HTMLDivElement>, dripRect?: DOMRect) => void
}

export const Drip = memo<DripProps>((
  {
    visible = false,
    color,
    onCompleted,
    className = '',
    top = 0,
    left = 0,
    onClick,
    ...props
  },
) => {
  const dripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drip = dripRef.current

    if (drip == null) {
      return
    }
    drip.addEventListener('animationend', onCompleted)

    return () => {
      if (drip == null) {
        return
      }
      drip.removeEventListener('animationend', onCompleted)
    }
  })

  if (!visible) {
    return null
  }

  return (
    <DripStyled ref={dripRef} className={className} {...props}>
      <svg
        height="20"
        style={{ top, left }}
        viewBox="0 0 20 20"
        width="20"
      >
        <g
          fill="none"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="1"
        >
          <g className="nextui-drip-filler" fill={color}>
            <rect height="100%" rx="10" width="100%" />
          </g>
        </g>
      </svg>
    </DripStyled>
  )
})
