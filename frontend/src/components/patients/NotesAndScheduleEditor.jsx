import React from 'react'
import StatusPill from './StatusPill'

export default function NotesAndScheduleEditor({
  selectedPatient,
  draftNote,
  setDraftNote,
  draftVisitDate,
  setDraftVisitDate,
  draftVisitTime,
  setDraftVisitTime,
  draftVisitType,
  setDraftVisitType,
}) {
  if (!selectedPatient) return null

  return (
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
    </div>
  )
}

