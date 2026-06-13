import { useState } from 'react'

export function useAdminFormState<T extends object>(initialValues: T) {
  const [values, setValues] = useState(initialValues)

  const update = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  return { values, update }
}
