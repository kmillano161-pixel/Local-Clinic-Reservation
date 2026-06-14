import React from 'react'
import { FaUser, FaPhoneAlt } from 'react-icons/fa'
import StatusPill from './StatusPill'

export default function PatientProfileCard({ selectedPatient, scheduleList, onManage, onSelectLabel }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Patient Info</h2>
          <p className="text-sm text-gray-600 mt-1">{onSelectLabel ?? 'Select a patient from the table.'}</p>
        </div>

        {selectedPatient ? (
          <button
            type="button"
            onClick={() => onManage?.(selectedPatient.id)}
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
              {scheduleList?.slice(0, 3).length ? (
                scheduleList.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{v.type}</div>
                      <div className="text-xs text-gray-600">
                        {v.date} • {v.time}
                      </div>
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
  )
}

