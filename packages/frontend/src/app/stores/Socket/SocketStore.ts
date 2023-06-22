import { makeAutoObservable } from 'mobx'

import { BlockStore } from '../BlockStore/BlockStore'
import { RootStore } from '../RootStore'

interface sendQueueType {
  message: string
  onMessage: (event: MessageEvent) => void
  onConnect?: () => void
}

export class SocketStore {
  socket?: WebSocket
  blockStore: BlockStore
  sendQueue: sendQueueType[]

  constructor ({ blockStore }: RootStore) {
    this.sendQueue = []
    this.blockStore = blockStore
    makeAutoObservable(this, {
      blockStore: false,
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.onclose = () => {}
      this.socket.close()
      this.socket = undefined
    }
  }

  createConnection(url: string) {
    const socket = new WebSocket(url)
    this.socket = socket
    this.socket.onopen = () => {
      this.sendQueue.forEach((item) => {
        this.socket?.send(item.message)
        item.onConnect?.()
        if (this.socket) {
          this.socket.onmessage = item.onMessage
        }
      })
    }
    socket.onclose = () => {
      setTimeout(() => this.createConnection(url), 2000)
    }
  }

  subscribeToBlock() {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.blockStore.setCurrentBlock(data)
      }
    }
  }
}
