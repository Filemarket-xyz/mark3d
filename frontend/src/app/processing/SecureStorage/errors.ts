import { chainError } from '../../utils/error/chainError'

export class EncryptError extends Error {
  constructor(error: unknown) {
    const { message, stack } = chainError(error)
    super(`SecureStorage: StorageSecurityProvider.encrypt error: ${message}`)
    this.name = 'EncryptCallbackError'
    this.stack = stack
  }
}

export class DecryptError extends Error {
  constructor(error: unknown) {
    const { message, stack } = chainError(error)
    super(`SecureStorage: StorageSecurityProvider.decrypt error: ${message}`)
    this.name = 'DecryptCallbackError'
    this.stack = stack
  }
}

export class CallbacksChanging extends Error {
  constructor() {
    super('SecureStorage: calling class methods is not allowed until' +
      ' Promise returned by SecureStorage.setSecurityProvider is not finished')
    this.name = 'CallbacksChanging'
  }
}

export class UploadError extends Error {
  constructor(error: unknown) {
    const { message, stack } = chainError(error)
    super(`SecureStorage: StorageProvider.upload error: ${message}`)
    this.name = 'UploadError'
    this.stack = stack
  }
}

export class UploadSingleError extends Error {
  constructor(error: unknown) {
    const { message, stack } = chainError(error)
    super(`SecureStorage: StorageProvider.uploadSingle error: ${message}`)
    this.name = 'UploadSingleError'
    this.stack = stack
  }
}

export class LoadError extends Error {
  constructor(error: unknown) {
    const { message, stack } = chainError(error)
    super(`SecureStorage: StorageProvider.load error: ${message}`)
    this.name = 'LoadError'
    this.stack = stack
  }
}
