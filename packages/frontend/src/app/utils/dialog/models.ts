import { ComponentType } from 'react'

export interface DialogProps {
  open: boolean
  onClose: () => void
}

export type AppDialogProps<T> = T & DialogProps

export interface DialogCall<Props extends DialogProps> {
  component: ComponentType<Props>
  props: Omit<Props, keyof DialogProps>
}

export type DialogCallInstance = DialogCall<any> & {
  id: number
  open: boolean
  onClosed: () => void // used to notify that dialog has been closed
}
