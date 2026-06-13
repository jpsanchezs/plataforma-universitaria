import { useCallback, useMemo, useState } from 'react'
import type { AcademicPeriod, PeriodStatus } from '@/types/academic'
import type { ID } from '@/types/common'
import {
  getAdminPeriodsSummary,
  getEffectivePeriods,
} from '@/data/selectors'
import {
  ADMIN_COURSES_STORAGE_KEY,
  ADMIN_PERIODS_STORAGE_KEY,
} from '@/features/admin/constants'
import type {
  AdminCoursesStorage,
  AdminFeedback,
  AdminPeriodsStorage,
  PeriodFormValues,
} from '@/features/admin/types'
import {
  emptyAdminCoursesStorage,
  emptyAdminPeriodsStorage,
} from '@/features/admin/types'
import {
  defaultPeriodFormValues,
  validatePeriodForm,
  type FormErrors,
} from '@/features/admin/utils/validation'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function applyPeriodPatch(
  storage: AdminPeriodsStorage,
  periodId: ID,
  patch: Partial<AcademicPeriod>,
): AdminPeriodsStorage {
  const isCreated = storage.created.some((period) => period.id === periodId)

  if (isCreated) {
    return {
      ...storage,
      created: storage.created.map((period) =>
        period.id === periodId ? { ...period, ...patch } : period,
      ),
    }
  }

  return {
    ...storage,
    updated: {
      ...storage.updated,
      [periodId]: { ...storage.updated[periodId], ...patch },
    },
  }
}

function closeOtherActivePeriods(
  storage: AdminPeriodsStorage,
  activePeriodId: ID,
): AdminPeriodsStorage {
  let next = storage
  getEffectivePeriods(storage).forEach((period) => {
    if (period.id === activePeriodId || period.status !== 'activo') {
      return
    }
    next = applyPeriodPatch(next, period.id, { status: 'cerrado' })
  })
  return next
}

export function useAdminPeriods() {
  const [storage, setStorage] = useLocalStorage<AdminPeriodsStorage>(
    ADMIN_PERIODS_STORAGE_KEY,
    emptyAdminPeriodsStorage(),
  )
  const [courseStorage] = useLocalStorage<AdminCoursesStorage>(
    ADMIN_COURSES_STORAGE_KEY,
    emptyAdminCoursesStorage(),
  )
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors<PeriodFormValues>>({})

  const periods = useMemo(() => getEffectivePeriods(storage), [storage])
  const summary = useMemo(() => getAdminPeriodsSummary(storage), [storage])

  const savePeriod = useCallback(
    (
      values: PeriodFormValues,
      editingId?: ID,
    ): boolean => {
      const errors = validatePeriodForm(values)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setFeedback({ type: 'error', message: 'Revise los campos del formulario.' })
        return false
      }

      const payload: Partial<AcademicPeriod> = {
        name: values.name.trim(),
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
      }

      if (editingId) {
        setStorage((current) => {
          let next = applyPeriodPatch(current, editingId, payload)
          if (values.status === 'activo') {
            next = closeOtherActivePeriods(next, editingId)
            next = applyPeriodPatch(next, editingId, payload)
          }
          return next
        })
        setFormErrors({})
        setFeedback({ type: 'success', message: 'Período actualizado correctamente.' })
        return true
      }

      const newPeriod: AcademicPeriod = {
        id: `per-admin-${Date.now()}`,
        name: values.name.trim(),
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
      }

      setStorage((current) => {
        let next: AdminPeriodsStorage = {
          ...current,
          created: [...current.created, newPeriod],
        }
        if (values.status === 'activo') {
          next = closeOtherActivePeriods(next, newPeriod.id)
        }
        return next
      })
      setFormErrors({})
      setFeedback({ type: 'success', message: 'Período creado correctamente.' })
      return true
    },
    [setStorage],
  )

  const createPeriod = useCallback(
    (values: PeriodFormValues) => savePeriod(values),
    [savePeriod],
  )

  const updatePeriod = useCallback(
    (periodId: ID, values: PeriodFormValues) => savePeriod(values, periodId),
    [savePeriod],
  )

  const changePeriodStatus = useCallback(
    (periodId: ID, status: PeriodStatus) => {
      const period = periods.find((item) => item.id === periodId)
      if (!period) {
        return
      }

      savePeriod(
        {
          name: period.name,
          startDate: period.startDate,
          endDate: period.endDate,
          status,
        },
        periodId,
      )
    },
    [periods, savePeriod],
  )

  const clearFeedback = useCallback(() => setFeedback(null), [])
  const clearFormErrors = useCallback(() => setFormErrors({}), [])

  return {
    periods,
    summary,
    courseStorage,
    feedback,
    formErrors,
    createPeriod,
    updatePeriod,
    changePeriodStatus,
    clearFeedback,
    clearFormErrors,
    defaultFormValues: defaultPeriodFormValues,
  }
}
