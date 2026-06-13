import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { NotFoundPage } from '@/features/auth/pages/NotFoundPage'
import { UnauthorizedPage } from '@/features/auth/pages/UnauthorizedPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { StudentsManagementPage } from '@/features/admin/pages/StudentsManagementPage'
import { TeachersManagementPage } from '@/features/admin/pages/TeachersManagementPage'
import { CoursesManagementPage } from '@/features/admin/pages/CoursesManagementPage'
import { AcademicPeriodsPage } from '@/features/admin/pages/AcademicPeriodsPage'
import { TuitionPaymentsPage } from '@/features/finance/pages/TuitionPaymentsPage'
import { CoursePaymentsPage } from '@/features/finance/pages/CoursePaymentsPage'
import { PaymentHistoryPage } from '@/features/finance/pages/PaymentHistoryPage'
import { FinancialStatusPage } from '@/features/finance/pages/FinancialStatusPage'
import { AcademicExecutiveDashboardPage } from '@/features/executive/pages/AcademicExecutiveDashboardPage'
import { ProjectExecutiveDashboardPage } from '@/features/executive/pages/ProjectExecutiveDashboardPage'
import { StudentProfilePage } from '@/features/student/pages/StudentProfilePage'
import { EnrollmentPage } from '@/features/student/pages/EnrollmentPage'
import { SchedulePage } from '@/features/student/pages/SchedulePage'
import { GradesPage } from '@/features/student/pages/GradesPage'
import { AccountStatusPage } from '@/features/student/pages/AccountStatusPage'
import { AcademicHistoryPage } from '@/features/student/pages/AcademicHistoryPage'
import { TeacherCoursesPage } from '@/features/teacher/pages/TeacherCoursesPage'
import { AttendancePage } from '@/features/teacher/pages/AttendancePage'
import { TeacherGradesPage } from '@/features/teacher/pages/TeacherGradesPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'
import { RootRedirect } from '@/routes/RootRedirect'
import { ROUTES } from '@/utils/routes'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.FORBIDDEN} element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.ROOT} element={<RootRedirect />} />

            <Route element={<RoleRoute />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

              <Route path={ROUTES.STUDENT.PROFILE} element={<StudentProfilePage />} />
              <Route path={ROUTES.STUDENT.ENROLLMENT} element={<EnrollmentPage />} />
              <Route path={ROUTES.STUDENT.SCHEDULE} element={<SchedulePage />} />
              <Route path={ROUTES.STUDENT.GRADES} element={<GradesPage />} />
              <Route path={ROUTES.STUDENT.ACCOUNT} element={<AccountStatusPage />} />
              <Route path={ROUTES.STUDENT.HISTORY} element={<AcademicHistoryPage />} />

              <Route path={ROUTES.TEACHER.COURSES} element={<TeacherCoursesPage />} />
              <Route path={ROUTES.TEACHER.ATTENDANCE} element={<AttendancePage />} />
              <Route path={ROUTES.TEACHER.GRADES} element={<TeacherGradesPage />} />

              <Route path={ROUTES.ADMIN.STUDENTS} element={<StudentsManagementPage />} />
              <Route path={ROUTES.ADMIN.TEACHERS} element={<TeachersManagementPage />} />
              <Route path={ROUTES.ADMIN.COURSES} element={<CoursesManagementPage />} />
              <Route path={ROUTES.ADMIN.PERIODS} element={<AcademicPeriodsPage />} />

              <Route path={ROUTES.FINANCE.TUITION} element={<TuitionPaymentsPage />} />
              <Route path={ROUTES.FINANCE.COURSES} element={<CoursePaymentsPage />} />
              <Route path={ROUTES.FINANCE.HISTORY} element={<PaymentHistoryPage />} />
              <Route path={ROUTES.FINANCE.STATUS} element={<FinancialStatusPage />} />

              <Route
                path={ROUTES.EXECUTIVE.ACADEMIC}
                element={<AcademicExecutiveDashboardPage />}
              />
              <Route
                path={ROUTES.EXECUTIVE.PROJECT}
                element={<ProjectExecutiveDashboardPage />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
