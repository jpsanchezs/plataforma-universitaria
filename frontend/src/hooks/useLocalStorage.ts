import { useCallback, useState } from 'react'

function readStoredValue<T>(key: string, initialValue: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return initialValue
    }
    return JSON.parse(item) as T
  } catch {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignorar errores al limpiar clave corrupta
    }
    return initialValue
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((current: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readStoredValue(key, initialValue),
  )

  const setValue = useCallback(
    (value: T | ((current: T) => T)) => {
      setStoredValue((current) => {
        const nextValue = value instanceof Function ? value(current) : value
        try {
          localStorage.setItem(key, JSON.stringify(nextValue))
        } catch {
          // Ignorar errores de almacenamiento (cuota, modo privado, etc.)
        }
        return nextValue
      })
    },
    [key],
  )

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignorar errores de almacenamiento
    }
    setStoredValue(initialValue)
  }, [initialValue, key])

  return [storedValue, setValue, removeValue]
}
