import { useLocalStorage } from '@/hooks/useLocalStorage'
import { FINANCE_PAYMENTS_STORAGE_KEY } from '@/features/finance/constants'
import {
  emptyFinancePaymentsStorage,
  type FinancePaymentsStorage,
} from '@/features/finance/types'

export function useFinancePaymentStorage(): [
  FinancePaymentsStorage,
  (value: FinancePaymentsStorage | ((current: FinancePaymentsStorage) => FinancePaymentsStorage)) => void,
] {
  const [storage, setStorage] = useLocalStorage<FinancePaymentsStorage>(
    FINANCE_PAYMENTS_STORAGE_KEY,
    emptyFinancePaymentsStorage(),
  )
  return [storage, setStorage]
}
