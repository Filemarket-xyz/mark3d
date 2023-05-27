export const arrayToRecord = <Key extends string | number | symbol, Value>(
  array: Array<[Key, Value]>,
): Record<Key, Value> =>
  array.reduce(
    (acc, next) => {
      acc[next[0]] = next[1]

      return acc
    },
    Object.create(null),
  )
