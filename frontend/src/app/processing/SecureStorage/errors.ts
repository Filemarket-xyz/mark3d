export class EncryptCallbackError extends Error {
  constructor(error: Error) {
    super(`SecureStorage: encrypt callback error: ${error.message}`)
    this.name = 'EncryptCallbackError'
    this.stack = error?.stack
  }
}

export class DecryptCallbackError extends Error {
  constructor(error: Error) {
    super(`SecureStorage: decrypt callback error: ${error.message}`)
    this.name = 'DecryptCallbackError'
    this.stack = error?.stack
  }
}

export class CallbacksChanging extends Error {
  constructor() {
    super('SecureStorage: calling class methods is not allowed until Promise returned by SecureStorage.setCallbacks is not finished')
    this.name = 'CallbacksChanging'
  }
}
