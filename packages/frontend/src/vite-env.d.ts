/// <reference types="vite/client" />

declare namespace CSS {
  function registerProperty (definition: {
    name: string
    syntax?: string
    inherits: boolean
    initialValue?: string
  }): void
}
