export const wrappedCall = <Args extends any[], ReturnType>(
  ErrorClass: new (error: unknown) => Error, func?: (...args: Args) => ReturnType, ...args: Args
): ReturnType => {
  if (!func) {
    throw new ErrorClass(new Error('no function provided'))
  }
  try {
    return func(...args)
  } catch (error) {
    throw new ErrorClass(error)
  }
}
