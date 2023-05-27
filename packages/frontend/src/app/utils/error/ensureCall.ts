/**
 * For better tracing. Stack trace is not providing function name, if it is undefined.
 * @param funcName
 * @param func
 * @param args
 */
export const ensureCall = <Args extends any[], ReturnType>(
  funcName: string, func?: (...args: Args) => ReturnType, ...args: Args
): ReturnType => {
  if (!func) {
    throw new Error(`${funcName} no function provided`)
  }

  return func(...args)
}
