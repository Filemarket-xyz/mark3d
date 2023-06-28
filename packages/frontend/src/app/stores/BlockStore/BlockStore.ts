import { BigNumber } from 'ethers'
import { makeAutoObservable } from 'mobx'

export class BlockStore {
  currentBlockNumber: BigNumber // Dynamic block number from the rpc
  receiptBlockNumber: BigNumber // Block number from transaction
  lastCurrentBlockNumber: BigNumber // A block number that is equal to the value of currentBlockNumber at the time of the transaction

  constructor() {
    this.receiptBlockNumber = BigNumber.from(0)
    this.currentBlockNumber = BigNumber.from(1)
    this.lastCurrentBlockNumber = BigNumber.from(1)
    makeAutoObservable(this)
  }

  setCurrentBlock = (currentBlock: BigNumber) => {
    this.currentBlockNumber = currentBlock
    console.log(currentBlock)
  }

  setRecieptBlock = (recieptBlock: BigNumber | number) => {
    console.log(recieptBlock)
    this.receiptBlockNumber = BigNumber.from(recieptBlock)
    this.lastCurrentBlockNumber = this.currentBlockNumber
    console.log('receipt block', this.receiptBlockNumber, 'current block', this.currentBlockNumber, 'delta', this.receiptBlockNumber.sub(this.lastCurrentBlockNumber))
  }

  get canContinue() {
    return this.currentBlockNumber.gte(this.receiptBlockNumber)
  }
}
