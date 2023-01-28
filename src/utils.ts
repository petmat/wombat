export function prop<K extends string>(
  k: K
): <T extends Record<K, any>>(obj: T) => T[K];
export function prop<K extends keyof T, T extends object>(k: K, obj: T): T[K];
export function prop<K extends string, T extends Record<K, any>>(
  k: K,
  obj?: T
): T[K] | ((obj: T) => T[K]) {
  if (obj === undefined) {
    return <T extends Record<K, any>>(obj: T): T[K] => obj[k];
  } else {
    return obj[k];
  }
}
