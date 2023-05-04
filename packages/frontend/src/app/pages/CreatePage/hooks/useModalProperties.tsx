import { ReactNode, useState } from 'react'

/** This hook is a wrapper above useState */
export const useModalProperties = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalBody, setModalBody] = useState<ReactNode>()
  const [modalHeader, setModalHeader] = useState<ReactNode>()
  return {
    modalOpen,
    setModalOpen,
    modalBody,
    setModalBody,
    modalHeader,
    setModalHeader
  }
}
