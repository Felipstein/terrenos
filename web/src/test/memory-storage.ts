// localStorage em memória pros testes (o vitest roda em node, sem DOM).
export function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
    clear: () => {
      map.clear()
    },
    key: (index) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size
    },
  }
}
