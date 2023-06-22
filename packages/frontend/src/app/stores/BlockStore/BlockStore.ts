import { makeAutoObservable } from 'mobx'

export class BlockStore {
  currentBlock: any
  recieptBlock: any

  constructor() {
    makeAutoObservable(this)
  }

  setCurrentBlock = (currentBlock: any) => {
    this.currentBlock = currentBlock
  }

  setRecieptBlock = (recieptBlock: any) => {
    this.recieptBlock = recieptBlock
  }

  get canContinue() {
    return this.currentBlock.last_block_number < +this.recieptBlock.last_block_number + 1
  }
}
