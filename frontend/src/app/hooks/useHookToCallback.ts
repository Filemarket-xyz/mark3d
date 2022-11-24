import { useCallback, useState } from 'react'
import { useAfterDidMountEffect } from './useDidMountEffect'

export function useHookToCallback<
  HookArgs extends any[],
  CallbackName extends keyof any,
  HookReturnType extends { [Key in CallbackName]: () => void },
  >(
  hook: (...args: HookArgs) => HookReturnType,
  callbackName: CallbackName,
  ...initialHookArgs: HookArgs
): Omit<HookReturnType, CallbackName> & { [Key in CallbackName]: (...args: HookArgs) => void } {
  const [args, setArgs] = useState<HookArgs>(initialHookArgs)
  const hookReturnValue = hook(...args)
  const { [callbackName]: hookCallback, ...other } = hookReturnValue
  const wrappedCallback = useCallback((...actualArgs: HookArgs) => {
    setArgs(actualArgs)
  }, [setArgs])
  useAfterDidMountEffect(() => {
    void hookCallback()
  }, [args])
  const callbackObj: { [Key in CallbackName]: (...args: HookArgs) => void } = {
    [callbackName]: wrappedCallback
  } as any
  return { ...callbackObj, ...other }
}
