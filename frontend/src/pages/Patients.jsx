import { useEffect, useMemo, useState } from 'react'
import { FaCalendarAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa'

import KpiCard from '../components/patients/KpiCard'
import PatientsTable from '../components/patients/PatientsTable'
import PatientProfileCard from '../components/patients/PatientProfileCard'
import Modal from '../components/patients/Modal'
import ManagePatientModal from '../components/patients/ManagePatientModal'

export default function Patients() {
  const [query, setQuery] = useState('')

  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const [notesByPatient, setNotesByPatient] = useState(() => {
    try {
      const raw = window.localStorage.getItem('clinic_patient_notes')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const [scheduleByPatient, setScheduleByPatient] = useState(() => {
    try {
      const raw = window.localStorage.getItem('clinic_patient_schedule')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const patients = useMemo(
    () => [
      {
        id: 'p-1',
        name: 'Kenneth',
        phone: '+1 (555) 123-4567',
        location: 'Downtown',
        status: 'active',
      },
      {
        id: 'p-2',
        name: 'John',
        phone: '+1 (555) 987-6543',
        location: 'Northside',
        status: 'active',
      },
      {
        id: 'p-3',
        name: 'Millano',
        phone: '+1 (555) 555-1212',
        location: 'West End',
        status: 'inactive',
      },
    ],
    []
  )

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) ?? null
  }, [patients, selectedPatientId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) =>
      [p.name, p.phone, p.location, p.status].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    )
  }, [patients, query])

  // Sync selected patient with filtered results so search updates the profile card
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedPatientId(null)
      return
    }

    const stillVisible =
      selectedPatientId && filtered.some((p) => p.id === selectedPatientId)

    if (!stillVisible) {
      setSelectedPatientId(filtered[0].id)
    }
  }, [filtered, selectedPatientId])

  const summary = useMemo(() => {
    const total = patients.length
    const active = patients.filter((p) => p.status === 'active').length
    const inactive = total - active
    return { total, active, inactive }
  }, [patients])

  // persist demo data
  try {
    window.localStorage.setItem('clinic_patient_notes', JSON.stringify(notesByPatient))
  } catch {
    // ignore
  }

  try {
    window.localStorage.setItem(
      'clinic_patient_schedule',
      JSON.stringify(scheduleByPatient)
    )
  } catch {
    // ignore
  }

  // Draft modal fields
  const [draftNote, setDraftNote] = useState('')
  const [draftVisitDate, setDraftVisitDate] = useState('')
  const [draftVisitTime, setDraftVisitTime] = useState('')
  const [draftVisitType, setDraftVisitType] = useState('Check-up')

  // Keep drafts in sync when selecting a patient
  useMemo(() => {
    if (!selectedPatient) return

    setDraftNote(notesByPatient[selectedPatient.id] ?? '')

    const visits = scheduleByPatient[selectedPatient.id] ?? []
    const next = visits[0]

    setDraftVisitDate('')
    setDraftVisitTime('')
    setDraftVisitType(next?.type ?? 'Check-up')
  }, [selectedPatientId])

  const openEdit = (pid) => {
    setSelectedPatientId(pid)
    setEditOpen(true)
  }

  const closeEdit = () => {
    setEditOpen(false)
  }

  const saveNoteAndSchedule = () => {
    if (!selectedPatient) return

    setNotesByPatient((prev) => ({ ...prev, [selectedPatient.id]: draftNote }))

    if (draftVisitDate && draftVisitTime) {
      const newVisit = {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        date: draftVisitDate,
        time: draftVisitTime,
        type: draftVisitType,
        note: '',
      }

      setScheduleByPatient((prev) => {
        const prevList = prev[selectedPatient.id] ?? []
        return {
          ...prev,
          [selectedPatient.id]: [newVisit, ...prevList],
        }
      })

      setDraftVisitDate('')
      setDraftVisitTime('')
      setDraftVisitType('Check-up')
    }

    setEditOpen(false)
  }

  return (
    <div className="h-full min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Patient Management</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">Patients</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-700">
                Search patients, view info cards, and edit records / schedule visits.
              </p>
            </div>

            <div className="w-full sm:w-[340px]">
              <label className="block text-sm text-gray-600 mb-2" htmlFor="patient-search">
                Search
              </label>
              <input
                id="patient-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Search by name, phone, status..."
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <KpiCard icon={<FaUser />} title="Total Patients" number={summary.total} />
          <KpiCard icon={<FaCalendarAlt />} title="Active" number={summary.active} />
          <KpiCard icon={<FaMapMarkerAlt />} title="Inactive" number={summary.inactive} />
        </div>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PatientsTable
              patients={filtered}
              selectedPatientId={selectedPatientId}
              onSelect={(pid) => setSelectedPatientId(pid)}
              onEdit={(pid) => openEdit(pid)}
            />
          </div>

          <div className="lg:col-span-1">
            <PatientProfileCard
              selectedPatient={selectedPatient}
              scheduleList={selectedPatientId ? (scheduleByPatient[selectedPatientId] ?? []) : []}
              onManage={(pid) => openEdit(pid)}
            />
          </div>
        </div>

        {/* Edit modal */}
        <Modal
          open={editOpen && !!selectedPatient}
          title={selectedPatient ? `Manage ${selectedPatient.name}` : 'Manage patient'}
          onClose={closeEdit}
        >
          {selectedPatient ? (
            <ManagePatientModal
              open={editOpen && !!selectedPatient}
              title={selectedPatient ? `Manage ${selectedPatient.name}` : 'Manage patient'}
              selectedPatient={selectedPatient}
              draftNote={draftNote}
              setDraftNote={setDraftNote}
              draftVisitDate={draftVisitDate}
              setDraftVisitDate={setDraftVisitDate}
              draftVisitTime={draftVisitTime}
              setDraftVisitTime={setDraftVisitTime}
              draftVisitType={draftVisitType}
              setDraftVisitType={setDraftVisitType}
              onClose={closeEdit}
              onSave={saveNoteAndSchedule}
            />
          ) : null}
        </Modal>
      </div>
    </div>
  )
}

