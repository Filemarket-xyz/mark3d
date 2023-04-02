export const chainError = (error: unknown) => {
  let message: string
  let stack: string | undefined
  if (error instanceof Error) {
    message = error.message
    stack = error.stack
  } else {
    message = `${error}`
    stack = new Error().stack
  }
  return { message, stack }
}
