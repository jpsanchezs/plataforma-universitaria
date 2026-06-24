# Guía de demostración — Plataforma UTLM

Guion sugerido para presentar el prototipo (~15 minutos). Contraseña demo: **demo123**.

## Antes de empezar

1. Ejecute `npm run dev` en `frontend/`.
2. Abra `http://localhost:5173`.
3. Si ya probó el sistema, use **Datos demo** en el encabezado para volver al estado inicial.

---

## 1. Estudiante (3 min)

**Login:** `estudiante@utlm.demo`

1. **Dashboard** — cursos matriculados, saldo, promedio, próximo horario.
2. **Matrícula** — matricular o retirar un curso disponible.
3. **Horarios** — verificar que el horario refleja la matrícula.
4. **Calificaciones** — revisar notas del período.
5. **Estado de cuenta** — ver cargos pendientes y pagados.

---

## 2. Docente (2 min)

**Login:** `docente@utlm.demo`

1. **Calificaciones** — seleccionar un curso y actualizar una nota parcial.
2. **Asistencia** — marcar asistencia de un estudiante.

---

## 3. Estudiante de nuevo (1 min)

**Login:** `estudiante@utlm.demo`

1. **Calificaciones** — confirmar que la nota editada por el docente aparece.
2. **Dashboard** — ver promedio actualizado si aplica.

---

## 4. Finanzas (2 min)

**Login:** `finanzas@utlm.demo`

1. **Pagos de matrícula** — buscar **pay-001** (María Fernández).
2. **Marcar pagado** — confirmar feedback y persistencia.
3. **Historial** — ver el mismo pago en estado pagado.

---

## 5. Estudiante — cuenta (1 min)

**Login:** `estudiante@utlm.demo`

1. **Estado de cuenta** — verificar que pay-001 aparece pagado y el saldo bajó.

---

## 6. Ejecutivo académico (2 min)

**Login:** `ejecutivo@utlm.demo`

1. **Dashboard académico** — ingresos, morosidad, gráficas.
2. Confirmar que los ingresos reflejan el pago marcado en Finanzas.

---

## 7. Director de proyecto (2 min)

**Login:** `proyecto@utlm.demo`

1. **Dashboard del proyecto** — semáforo por dimensión (tiempo, costo, calidad, productividad, riesgos).
2. Revisar KPIs, riesgos abiertos y solicitudes de cambio.

---

## 8. Cierre (1 min)

1. **Datos demo** → Restablecer (mantener sesión o cerrar).
2. Recargar y confirmar estado inicial.

---

## Roles adicionales (opcional)

**Administrativo** (`admin@utlm.demo`): gestión de estudiantes, docentes, cursos y períodos. Recordar que los cambios admin tienen alcance limitado respecto a matrícula y portales docente.

**Dashboard principal** (`/dashboard`): resumen por rol con accesos rápidos a cada módulo.
