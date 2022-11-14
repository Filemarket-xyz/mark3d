export class CallbacksChangingError extends Error {
  constructor() {
    super('SecureStorage: calling class methods is not allowed until' +
      ' Promise returned by SecureStorage.setSecurityProvider is not finished')
    this.name = 'CallbacksChanging'
  }
}
