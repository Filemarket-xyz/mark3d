import { makeAutoObservable } from 'mobx'

export class BlockStore {
  currentBlockNumber: number // Dynamic block number from the socket
  receiptBlockNumber: number // Block number from transaction
  lastCurrentBlockNumber: number // A block number that is equal to the value of currentBlockNumber at the time of the transaction

  constructor() {
    this.receiptBlockNumber = 0
    this.currentBlockNumber = 1
    this.lastCurrentBlockNumber = 0
    makeAutoObservable(this)
  }

  setCurrentBlock = (currentBlock: number) => {
    this.currentBlockNumber = currentBlock
    console.log(currentBlock)
  }

  setRecieptBlock = (recieptBlock: number) => {
    this.receiptBlockNumber = recieptBlock
    this.lastCurrentBlockNumber = this.currentBlockNumber
    console.log(recieptBlock)
  }

  get canContinue() {
    return this.currentBlockNumber >= this.receiptBlockNumber
  }
}
