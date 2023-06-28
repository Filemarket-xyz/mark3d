import { BigNumber } from 'ethers'
import { makeAutoObservable } from 'mobx'

// rpc sometimes throws error even if currentBlockNumber === receiptBlockNumber
// so this constant adds extra delay
const extraConfirmations = 1

export class BlockStore {
  currentBlockNumber: BigNumber // Dynamic block number from the rpc
  receiptBlockNumber: BigNumber // Block number from transaction
  // A block number that is equal to the value of currentBlockNumber at the time of the transaction
  lastCurrentBlockNumber: BigNumber

  constructor() {
    this.receiptBlockNumber = BigNumber.from(0)
    this.currentBlockNumber = BigNumber.from(1)
    this.lastCurrentBlockNumber = BigNumber.from(1)
    makeAutoObservable(this)
  }

  reset(): void {
    this.receiptBlockNumber = BigNumber.from(0)
    this.currentBlockNumber = BigNumber.from(1)
    this.lastCurrentBlockNumber = BigNumber.from(1)
  }

  setCurrentBlock = (currentBlock: BigNumber) => {
    this.currentBlockNumber = currentBlock
    console.log(currentBlock)
  }

  setReceiptBlock = (recieptBlock: BigNumber | number) => {
    console.log(recieptBlock)
    this.receiptBlockNumber = BigNumber.from(recieptBlock)
    this.lastCurrentBlockNumber = this.currentBlockNumber
  }

  get confirmationsText(): string {
    const progress = this.currentBlockNumber.sub(this.lastCurrentBlockNumber).toString()
    const remaining = this.receiptBlockNumber.sub(this.lastCurrentBlockNumber).add(extraConfirmations).toString()

    return this.canContinue ? ''
      : `Confirmations: ${progress}/${remaining}`
  }

  get canContinue() {
    return this.lastCurrentBlockNumber.eq(1) || // to prevent accidental 324233/324234
      this.currentBlockNumber.gte(this.receiptBlockNumber.add(extraConfirmations))
  }
}
