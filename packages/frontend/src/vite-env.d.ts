/// <reference types="vite/client" />

declare namespace CSS {
  function registerProperty (propertyDefinition: {
    name: string
    syntax?: string
    inherits: boolean
    initialValue?: string
  }): void
}
