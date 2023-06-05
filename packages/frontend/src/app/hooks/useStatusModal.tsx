import { ReactNode, useCallback, useEffect } from 'react'

import { ErrorBody, extractMessageFromError, InProgressBody, SuccessOkBody } from '../components/Modal/Modal'
import { useModalProperties } from '../pages/CreatePage/hooks/useModalProperties'
import { useStatusState } from './useStatusState'

type StatusStateType = ReturnType<typeof useStatusState>

export interface UseModalOkArgs {
  statuses: StatusStateType['statuses']
  loadingMsg: ReactNode
  okMsg: ReactNode
  waitForSign?: boolean
  // error message is retrieved from error
}

export function useStatusModal({
  statuses: { isLoading, result, error },
  okMsg,
  loadingMsg,
  waitForSign = true,
}: UseModalOkArgs) {
  const {
    modalOpen,
    setModalOpen,
    modalBody,
    setModalBody,
  } = useModalProperties()

  const handleClose = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  useEffect(() => {
    if (isLoading || result || error) {
      setModalOpen(true)
    }
  }, [isLoading, result, error])

  useEffect(() => {
    if (isLoading) {
      setModalBody(
        <InProgressBody
          text={loadingMsg}
          waitForSign={waitForSign}
        />,
      )
    } else if (result) {
      setModalBody(
        <SuccessOkBody
          description={okMsg}
          handleClose={handleClose}
        />,
      )
    } else if (error) {
      setModalBody(
        <ErrorBody
          message={extractMessageFromError(error)}
          onClose={handleClose}
        />,
      )
    }
  }, [isLoading, result, error, loadingMsg, okMsg, waitForSign, handleClose])

  return {
    modalProps: {
      body: modalBody,
      open: modalOpen,
      handleClose,
      isError: !!error,
    },
    setModalOpen,
    setModalBody,
  }
}
