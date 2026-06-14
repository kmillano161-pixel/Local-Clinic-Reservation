import { useEffect, useMemo, useState } from 'react'

import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'

function StatusPill({ status }) {
  const cls =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'inactive'
        ? 'bg-gray-100 text-gray-700 border-gray-200'
        : 'bg-amber-50 text-amber-700 border-amber-200'

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${cls}`}
    >
      {status}
    </span>
  )
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full sm:max-w-2xl rounded-2xl bg-white border border-gray-100 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1.5 text-sm border border-gray-200 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  )
}

function Cards({ icon, title, number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 h-24 sm:h-28">
      <div className="text-blue-600 text-2xl w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        {icon ?? null}
      </div>
      <div className="flex-1">
        <p className="text-gray-500 text-sm">{title ?? ''}</p>
        <h2 className="text-gray-900 text-2xl font-semibold leading-none mt-1">{number ?? ''}</h2>
      </div>
    </div>
  )
}

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

  // Sync selected patient with filtered results so search updates the profile cards
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
    window.localStorage.setItem('clinic_patient_schedule', JSON.stringify(scheduleByPatient))
  } catch {
    // ignore
  }

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

      // clear fields
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
          <Cards icon={<FaUser />} title="Total Patients" number={summary.total} />
          <Cards icon={<FaCalendarAlt />} title="Active" number={summary.active} />
          <Cards icon={<FaMapMarkerAlt />} title="Inactive" number={summary.inactive} />
        </div>

        {/* Patient cards from selection */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Showing{' '}
                    <span className="font-semibold text-gray-900">{filtered.length}</span> patients
                  </div>
                  <div className="text-xs text-gray-500">Click a row or “Edit” to manage</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 bg-[#8d9195]">
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Location</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((p) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedPatientId === p.id ? 'bg-blue-50/60' : ''}`}
                        onClick={() => setSelectedPatientId(p.id)}
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">{p.name}</div>
                        </td>
                        <td className="px-4 py-4 text-gray-700 text-sm">{p.phone}</td>
                        <td className="px-4 py-4 text-gray-700 text-sm">{p.location}</td>
                        <td className="px-4 py-4">
                          <StatusPill status={p.status} />
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEdit(p.id)
                            }}
                            className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                          No patients found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Selected patient info cards */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Patient Info</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Select a patient from the table.
                  </p>
                </div>
                {selectedPatient ? (
                  <button
                    type="button"
                    onClick={() => openEdit(selectedPatient.id)}
                    className="rounded-xl px-3 py-2 text-sm border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                  >
                    Manage
                  </button>
                ) : null}
              </div>

              {selectedPatient ? (
                <div className="mt-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FaUser />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">{selectedPatient.name}</div>
                      <div className="text-sm text-gray-600">{selectedPatient.location}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Phone</div>
                      <div className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                        <FaPhoneAlt /> {selectedPatient.phone}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Status</div>
                      <div className="mt-1"> 
                        <StatusPill status={selectedPatient.status} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-3">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Upcoming Schedule</div>
                    <div className="mt-2 space-y-2">
                      {(scheduleByPatient[selectedPatient.id] ?? []).slice(0, 3).length ? (
                        (scheduleByPatient[selectedPatient.id] ?? []).slice(0, 3).map((v) => (
                          <div
                            key={v.id}
                            className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2"
                          >
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{v.type}</div>
                              <div className="text-xs text-gray-600">{v.date} • {v.time}</div>
                            </div>
                            <span className="text-xs text-gray-500">Scheduled</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-600">No scheduled visits yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-sm text-gray-600">No patient selected.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={editOpen && !!selectedPatient}
        title={selectedPatient ? `Manage ${selectedPatient.name}` : 'Manage patient'}
        onClose={closeEdit}
      >
        {selectedPatient ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Record Notes</div>
                  <div className="text-xs text-gray-600">Saved locally (demo)</div>
                </div>
                <StatusPill status={selectedPatient.status} />
              </div>

              <textarea
                className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                rows={4}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="Add patient record notes..."
              />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="text-sm font-semibold text-gray-900">Schedule a visit</div>
              <div className="text-xs text-gray-600 mt-1">Add date + time. Will show up in the patient card.</div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={draftVisitDate}
                    onChange={(e) => setDraftVisitDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Time</label>
                  <input
                    type="time"
                    value={draftVisitTime}
                    onChange={(e) => setDraftVisitTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Type</label>
                  <select
                    value={draftVisitType}
                    onChange={(e) => setDraftVisitType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option>Check-up</option>
                    <option>Consultation</option>
                    <option>Follow-up</option>
                    <option>Vaccination</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-xl px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveNoteAndSchedule}
                className="rounded-xl px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

