
import { JsonRpcError, serializeError } from '@metamask/rpc-errors'
import { Contract, ContractTransaction } from 'ethers'

import { wagmiClient } from '../../config/web3Modal'

const TWO_MINUTES = 120_000 as const

export const wait = (miliseconds: number) => new Promise<void>((resolve) => {
  setTimeout(() => resolve(), miliseconds)
})

const fallbackError = { code: 500, message: 'unknown' }

const stringifyContractError = (error: any) => {
  let message = 'Unknown'
  if ('code' in error && error.code === 'ACTION_REJECTED') {
    message = 'Contract call rejected by user.'
  }

  const serializedError = serializeError(error, { fallbackError })

  if (serializedError.code === 500 && (serializedError.data as any)?.cause?.error?.data?.message) {
    const rawMessage: string = (serializedError.data as any).cause.error.data.message
    // vm error is truncated and useless
    message = rawMessage.split(', vm error:')[0]
  } else if (serializedError.code === 504) {
    message = serializedError.message
  } else {
    message = `Contract call failed. Please try again. Reason: ${serializedError.message}`
  }

  return message
}

export const catchContractGetterError = async <R = any>({
  contract,
  method
}: {
  contract: Contract
  method: keyof Contract
},
  ...args: any[]
): Promise<R> => {
  try {
    await contract.callStatic[method](...args)
    return contract[method](...args)
  } catch (error: any) {
    console.error(error)

    throw new Error(stringifyContractError(error))
  }
}

export const catchContractCallError = async ({
  contract,
  method,
  ignoreTxFailture
}: {
  contract: Contract
  method: keyof Contract
  ignoreTxFailture?: boolean
},
...args: any[]
) => {
  try {
    await contract.callStatic[method](...args)
    const tx: ContractTransaction = await contract[method](...args)

    if (ignoreTxFailture) {
      return await tx.wait()
    }

    return await catchTxFailture(tx.hash)
  } catch (error: any) {
    console.error(error)

    throw new Error(stringifyContractError(error))
  }
}

export const catchTxFailture = async (txHash: string) => {
  let receipt = null
  const start = Date.now()

  while (receipt === null) {
    if (Date.now() - start > TWO_MINUTES) {
      throw new JsonRpcError(504, 'The transaction is taking too long to execute')
    }

    receipt = await wagmiClient.provider.getTransactionReceipt(txHash)

    if (receipt === null) {
      await wait(1000)
      continue
    }
  }

  return receipt
}
