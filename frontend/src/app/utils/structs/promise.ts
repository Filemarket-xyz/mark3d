export function tap<T>(callback: (v: T) => void): (v: T) => T {
  return (v) => {
    callback(v)
    return v
  }
}
