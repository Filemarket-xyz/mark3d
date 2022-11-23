import { useState } from 'react'

/** This hook is a wrapper above useState */
export const useModalProperties = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalBody, setModalBody] = useState<JSX.Element>()

  return {
    modalOpen,
    setModalOpen,
    modalBody,
    setModalBody
  }
}
