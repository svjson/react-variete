import type { ConfigTree } from '@/model'
import type { PersistentStore } from './persistent-store'

/**
 * No-op implementation of PersistentStore that reads and writes
 * absolutely nothing.
 */
export const nullStore = <
  Schema extends ConfigTree,
>(): PersistentStore<Schema> => {
  return {
    load() {
      return undefined
    },
    saveValue(_path, _value): void {},
    clear: function (): void {},
  } satisfies PersistentStore<Schema>
}
