import { Transfer, TransferStatus } from '../../../swagger/Api'
import { mark3dConfig } from '../../config/mark3d'

export const transferStatusInfo = (transfer?: Transfer) =>
  transfer?.statuses && transfer.statuses[0]

export const transferStatus = (transfer?: Transfer) =>
  transferStatusInfo(transfer)?.status

export const transferPermissions = {
  owner: {
    canApprove: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.PublicKeySet
    },
    canFinalize: (transfer?: Transfer) => {
      const statusInfo = transferStatusInfo(transfer)

      return statusInfo?.status === TransferStatus.PasswordSet &&
        statusInfo.timestamp &&
        statusInfo.timestamp + mark3dConfig.transferTimeout < Date.now()
    },
    canCancel: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return ( // if transfer is drafted and there is an order, we should cancel an order
        status === TransferStatus.Drafted &&
        (transfer?.orderId === null || transfer?.orderId === undefined)
      ) || (
        status !== undefined &&
        [
          TransferStatus.Created,
          TransferStatus.PublicKeySet,
          TransferStatus.PasswordSet
        ].includes(status)
      )
    },
    canCancelOrder: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.Drafted &&
        transfer?.orderId !== undefined && transfer?.orderId !== null
    }
  },
  buyer: {
    canCompleteDraft: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.Drafted
    },
    canFulfillOrder: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.Drafted &&
        transfer?.orderId !== undefined && transfer?.orderId !== null
    },
    canSetPublicKey: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.Created
    },
    canFinalize: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.PasswordSet
    },
    canReportFraud: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.PasswordSet
    },
    canViewHiddenFiles: (transfer?: Transfer) => {
      const status = transferStatus(transfer)

      return status === TransferStatus.PasswordSet ||
        status === TransferStatus.Finished
    },
    canCancel: (transfer?: Transfer) => {
      const statusInfo = transferStatusInfo(transfer)

      return statusInfo?.status === TransferStatus.PublicKeySet &&
        statusInfo.timestamp &&
        statusInfo.timestamp + mark3dConfig.transferTimeout < Date.now()
    },
    canWaitSeller: (transfer?: Transfer) => {
      const statusInfo = transferStatusInfo(transfer)
      console.log(statusInfo)

      return statusInfo?.status === TransferStatus.PublicKeySet
    }
  }
}
