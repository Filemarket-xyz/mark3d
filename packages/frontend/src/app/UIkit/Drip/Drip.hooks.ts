import { useState, RefObject, MouseEventHandler } from 'react'

export const useDrip = (
  ref: RefObject<HTMLElement>,
  initialValue = false
): {
    visible: boolean
    onClick: MouseEventHandler
    onCompleted: () => void
    top: number
    left: number
  } => {
  const [dripVisible, setDripVisible] = useState<boolean>(initialValue)
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  const dripCompletedHandle = () => {
    setDripVisible(false)
  }

  const clickHandler: MouseEventHandler = (event) => {
    const dripRect = ref.current?.getBoundingClientRect()
    const top = (dripRect != null) ? event.clientY - dripRect.y : 0
    const left = (dripRect != null) ? event.clientX - dripRect.x : 0
    setTop(top)
    setLeft(left)
    setDripVisible(true)
  }

  return {
    visible: dripVisible,
    onClick: clickHandler,
    onCompleted: dripCompletedHandle,
    top,
    left
  }
}
