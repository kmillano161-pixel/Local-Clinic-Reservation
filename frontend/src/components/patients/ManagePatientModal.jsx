import React from 'react'
import NotesAndScheduleEditor from './NotesAndScheduleEditor'

export default function ManagePatientModal({
  open,
  title,
  selectedPatient,
  draftNote,
  setDraftNote,
  draftVisitDate,
  setDraftVisitDate,
  draftVisitTime,
  setDraftVisitTime,
  draftVisitType,
  setDraftVisitType,
  onClose,
  onSave,
}) {
  if (!open) return null

  return (
    <div>
      <NotesAndScheduleEditor
        selectedPatient={selectedPatient}
        draftNote={draftNote}
        setDraftNote={setDraftNote}
        draftVisitDate={draftVisitDate}
        setDraftVisitDate={setDraftVisitDate}
        draftVisitTime={draftVisitTime}
        setDraftVisitTime={setDraftVisitTime}
        draftVisitType={draftVisitType}
        setDraftVisitType={setDraftVisitType}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  )
}


