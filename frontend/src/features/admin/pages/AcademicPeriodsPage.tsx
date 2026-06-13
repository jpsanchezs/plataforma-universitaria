import { useMemo, useState } from 'react'
import type { AcademicPeriod, PeriodStatus } from '@/types/academic'
import { useAdminPeriods } from '@/features/admin/hooks/useAdminPeriods'
import { AdminEntityToolbar } from '@/features/admin/components/AdminEntityToolbar'
import { AdminDataScopeAlert } from '@/features/admin/components/AdminDataScopeAlert'
import { AdminStatusModal } from '@/features/admin/components/AdminStatusModal'
import { EntityDetailModal } from '@/features/admin/components/EntityDetailModal'
import { PeriodFormModal } from '@/features/admin/components/PeriodFormModal'
import { PeriodsTable } from '@/features/admin/components/PeriodsTable'
import { periodToFormValues } from '@/features/admin/types'
import { getCoursesCountByPeriodId } from '@/data/selectors'
import { Alert } from '@/components/feedback/Alert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageShell } from '@/components/layout/PageShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FiCalendar, FiCheckCircle, FiClock, FiLayers } from 'react-icons/fi'
import { formatNumber, formatShortDate } from '@/utils/formatters'

const periodStatusOptions: { value: PeriodStatus; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'planificado', label: 'Planificado' },
]

export function AcademicPeriodsPage() {
  const {
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
    defaultFormValues,
  } = useAdminPeriods()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriod | null>(null)
  const [formValues, setFormValues] = useState(defaultFormValues())

  const filteredPeriods = useMemo(() => {
    const query = search.trim().toLowerCase()
    return periods.filter(
      (period) =>
        query.length === 0 ||
        period.name.toLowerCase().includes(query) ||
        period.status.toLowerCase().includes(query),
    )
  }, [periods, search])

  const openCreate = () => {
    clearFormErrors()
    setSelectedPeriod(null)
    setFormValues(defaultFormValues())
    setFormOpen(true)
  }

  const openEdit = (period: AcademicPeriod) => {
    clearFormErrors()
    setSelectedPeriod(period)
    setFormValues(periodToFormValues(period))
    setFormOpen(true)
  }

  const handleSubmit = (values: typeof formValues) => {
    const success = selectedPeriod
      ? updatePeriod(selectedPeriod.id, values)
      : createPeriod(values)
    if (success) {
      setFormOpen(false)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Períodos académicos"
        description="Configure calendarios institucionales, estados de apertura y cierre."
      />

      <AdminDataScopeAlert scope="periods" className="mb-4" />

      {feedback ? (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          className="mb-4"
          onDismiss={clearFeedback}
        >
          {feedback.message}
        </Alert>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total períodos" value={formatNumber(summary.total)} icon={<FiLayers size={18} />} />
        <StatCard
          label="Período activo"
          value={summary.activePeriod}
          icon={<FiCheckCircle size={18} />}
        />
        <StatCard label="Períodos cerrados" value={formatNumber(summary.closed)} icon={<FiCalendar size={18} />} />
        <StatCard label="Planificados" value={formatNumber(summary.planned)} icon={<FiClock size={18} />} />
      </div>

      <AdminEntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre o estado"
        onCreate={openCreate}
        createLabel="Nuevo período"
      />

      {filteredPeriods.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay períodos que coincidan con la búsqueda aplicada."
        />
      ) : (
        <PeriodsTable
          periods={filteredPeriods}
          courseStorage={courseStorage}
          onView={(period) => {
            setSelectedPeriod(period)
            setDetailOpen(true)
          }}
          onEdit={openEdit}
          onChangeStatus={(period) => {
            setSelectedPeriod(period)
            setStatusOpen(true)
          }}
        />
      )}

      <PeriodFormModal
        key={selectedPeriod?.id ?? 'new-period'}
        open={formOpen}
        title={selectedPeriod ? 'Editar período' : 'Nuevo período'}
        initialValues={formValues}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <EntityDetailModal
        open={detailOpen}
        title="Detalle del período"
        onClose={() => setDetailOpen(false)}
        fields={
          selectedPeriod
            ? [
                { label: 'Nombre', value: selectedPeriod.name },
                { label: 'Fecha inicio', value: formatShortDate(selectedPeriod.startDate) },
                { label: 'Fecha fin', value: formatShortDate(selectedPeriod.endDate) },
                { label: 'Estado', value: <StatusBadge status={selectedPeriod.status} /> },
                {
                  label: 'Cursos asociados',
                  value: formatNumber(
                    getCoursesCountByPeriodId(selectedPeriod.id, courseStorage),
                  ),
                },
              ]
            : []
        }
      />

      {selectedPeriod ? (
        <AdminStatusModal<PeriodStatus>
          key={selectedPeriod.id}
          open={statusOpen}
          title="Cambiar estado del período"
          currentStatus={selectedPeriod.status}
          options={periodStatusOptions}
          onClose={() => setStatusOpen(false)}
          onSave={(status) => {
            changePeriodStatus(selectedPeriod.id, status)
            setStatusOpen(false)
          }}
        />
      ) : null}
    </PageShell>
  )
}
