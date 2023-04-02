import { useCallback, useEffect, useState } from 'react'

/**
 * Хук-утилита позволяющая привести взаимодействие с хуками вида
 * ```typescript
 * const {minNFT} = useMintNFT()
 * ```
 * @param hook
 * @param callbackName
 * @param notifiers
 */
export function useHookToCallback<
  HookArgs extends any[], // not any[] cos hook signature must have at least one argument for this hook to work
  CallbackName extends keyof any,
  CallbackReturnType,
  MaybeAsyncCallbackReturnType extends Promise<CallbackReturnType> | CallbackReturnType,
  HookReturnType extends { [Key in CallbackName]: () => MaybeAsyncCallbackReturnType },
  >(
  hook: (...args: HookArgs) => HookReturnType,
  callbackName: CallbackName,
  notifiers?: { callbackOk?: (v: CallbackReturnType) => void, callbackError?: (error: any) => void }
): Omit<HookReturnType, CallbackName> & { [Key in CallbackName]: (...args: HookArgs) => void } {
  const [args, setArgs] = useState<HookArgs>([] as unknown as HookArgs)
  const hookReturnValue = hook(...args)
  const { [callbackName]: hookCallback, ...other } = hookReturnValue
  const wrappedCallback = useCallback((...actualArgs: HookArgs) => {
    setArgs(actualArgs)
  }, [setArgs])
  useEffect(() => {
    if (args?.[0]) {
      const returnedValue = hookCallback()
      try {
        if (returnedValue instanceof Promise) {
          returnedValue.then(notifiers?.callbackOk, notifiers?.callbackError)
        } else {
          notifiers?.callbackOk?.(returnedValue as unknown as CallbackReturnType)
        }
      } catch (e) {
        notifiers?.callbackError?.(e)
      }
    }
  }, [args])
  const callbackObj: { [Key in CallbackName]: (...args: HookArgs) => void } = {
    [callbackName]: wrappedCallback
  } as any
  return { ...callbackObj, ...other }
}
