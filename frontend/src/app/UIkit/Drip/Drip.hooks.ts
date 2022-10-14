import { useState } from 'react'

export const useDrip = (
  initialValue = false
): {
    visible: boolean
    onClick: () => void
    onCompleted: () => void
  } => {
  const [dripVisible, setDripVisible] = useState<boolean>(initialValue)

  const dripCompletedHandle = () => {
    setDripVisible(false)
  }

  const clickHandler = () => {
    setDripVisible(true)
  }

  return {
    visible: dripVisible,
    onClick: clickHandler,
    onCompleted: dripCompletedHandle
  }
}
