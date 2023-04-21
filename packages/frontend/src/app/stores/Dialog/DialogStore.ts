import { makeAutoObservable } from 'mobx'
import { ComponentType, ReactNode } from 'react'
import { DialogCall, DialogCallInstance, DialogProps } from '../../utils/dialog'
import { AlertSnackbar } from '../../UIkit'

export class DialogRef {
  public closeListeners: Array<() => void> = []

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly dialogCallId: number,
    public dialogStore: DialogStore
  ) {
  }

  close(): void {
    this.dialogStore.closeDialogById(this.dialogCallId)
  }

  onClose(callback: () => void): void {
    this.closeListeners.push(callback)
  }
}

export class DialogStore {
  instances: DialogCallInstance[] = []

  count = 0

  constructor() {
    makeAutoObservable(this, {
      count: false
    })
  }

  openDialog<Props extends DialogProps>(call: DialogCall<Props>) {
    this.count++
    const id = this.count
    const ref = new DialogRef(id, this)
    this.instances.push({
      ...call,
      id,
      open: true,
      onClosed: () => {
        ref.closeListeners.forEach((fn) => fn())
      }
    })
    return ref
  }

  private closeDialogByOpenIndex(openIndex: number): void {
    if (openIndex >= 0) {
      const instance = this.instances[openIndex]
      instance.open = false
      instance.onClosed?.()
      setTimeout(() => this.instances.splice(openIndex, 1), 1000)
    }
  }

  closeDialogById(id: number): void {
    const openIndex = this.instances.findIndex((instance) => instance.id === id)
    this.closeDialogByOpenIndex(openIndex)
  }

  closeDialog(component: ComponentType): void {
    for (let i = 0; i < this.instances.length; i++) {
      if (this.instances[i].component === component) {
        this.closeDialogByOpenIndex(i)
      }
    }
  }

  showError(error: ReactNode): DialogRef {
    return this.openDialog({
      component: AlertSnackbar,
      props: {
        severity: 'error',
        duration: 10000,
        body: error
      }
    })
  }

  showSuccess(msg: ReactNode): DialogRef {
    return this.openDialog({
      component: AlertSnackbar,
      props: {
        severity: 'success',
        duration: 5000,
        body: msg
      }
    })
  }

  showWarning(msg: ReactNode): DialogRef {
    return this.openDialog({
      component: AlertSnackbar,
      props: {
        severity: 'warning',
        duration: 5000,
        body: msg
      }
    })
  }
}
