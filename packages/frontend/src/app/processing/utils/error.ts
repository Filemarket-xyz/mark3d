
import { serializeError } from '@metamask/rpc-errors'
import { ContractTransaction } from 'ethers'

import { wagmiClient } from '../../config/web3Modal'

export const wait = (miliseconds: number) => new Promise<void>((resolve) => {
  setTimeout(() => resolve(), miliseconds)
})

const fallbackError = { code: 500, message: 'unknown' }

export const catchContractGetterError = async <T>(call: () => Promise<T>) => {
  try {
    return await call()
  } catch (error) {
    console.error(error)

    const { message } = serializeError(error, { fallbackError })
    throw new Error(`Contract request failed. Please try again. Reason: ${message}`)
  }
}

export const catchContractCallError = async (
  call: () => Promise<ContractTransaction>,
  options?: { ignoreTxFailture: boolean }
) => {
  try {
    const tx = await call()

    if (options?.ignoreTxFailture) {
      return await tx.wait()
    }
    return await catchTxFailture(tx.hash)
  } catch (error: any) {
    console.error(error)

    if ('code' in error && error.code === 'ACTION_REJECTED') {
      throw new Error('Contract call rejected by user.')
    }

    const { message } = serializeError(error, { fallbackError })
    throw new Error(`Contract call failed. Please try again. Reason: ${message}`)
  }
}

export const catchTxFailture = async (txHash: string) => {
  let receipt = null

  while (receipt === null) {
    receipt = await wagmiClient.provider.getTransactionReceipt(txHash)

    if (receipt === null) {
      await wait(1000)
      continue
    }
  }

  return receipt
}
