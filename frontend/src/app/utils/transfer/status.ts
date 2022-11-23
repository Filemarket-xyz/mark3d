import { Transfer, TransferStatus } from '../../../swagger/Api'
import { mark3dConfig } from '../../config/mark3d'

export const transferStatusInfo = (transfer?: Transfer) =>
  transfer?.statuses && transfer.statuses[transfer.statuses.length - 1]

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
      return status !== undefined &&
        [
          TransferStatus.Drafted,
          TransferStatus.Created,
          TransferStatus.PublicKeySet,
          TransferStatus.PasswordSet
        ].includes(status)
    }
  },
  buyer: {
    canCompleteDraft: (transfer?: Transfer) => {
      const status = transferStatus(transfer)
      return status === TransferStatus.Drafted
    },
    canFulfillOrder: (transfer?: Transfer) => {
      const status = transferStatus(transfer)
      return status === TransferStatus.Drafted && transfer?.orderId !== undefined && transfer?.orderId !== null
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
    canCancel: (transfer?: Transfer) => {
      const statusInfo = transferStatusInfo(transfer)
      return statusInfo?.status === TransferStatus.PublicKeySet &&
        statusInfo.timestamp &&
        statusInfo.timestamp + mark3dConfig.transferTimeout < Date.now()
    }
  }
}
