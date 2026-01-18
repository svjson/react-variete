import type { ConfigTree } from '@/model'
import type { PersistentStore } from './persistent-store'
import { writePath } from '@whimbrel/walk'

/**
 * Implementation of PersistentStore that synchronously reads
 * and writes to localStorage
 */
export const localStorageStore = <Schema extends ConfigTree>(
  storeKey: string
): PersistentStore<Schema> => {
  return {
    load() {
      const storedData = localStorage.getItem(storeKey)
      if (storedData) return JSON.parse(storedData)
    },
    saveValue(path, value): void {
      const transientConfig = this.load() ?? {}
      writePath(transientConfig, path, value)
      localStorage.setItem(storeKey, JSON.stringify(transientConfig))
    },
    clear: function (): void {
      localStorage.removeItem(storeKey)
    },
  } satisfies PersistentStore<Schema>
}
