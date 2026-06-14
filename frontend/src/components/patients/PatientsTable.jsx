import React from 'react'
import StatusPill from './StatusPill'

export default function PatientsTable({
  patients,
  selectedPatientId,
  onSelect,
  onEdit,
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{patients.length}</span> patients
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
            {patients.map((p) => (
              <tr
                key={p.id}
                className={`hover:bg-gray-50 cursor-pointer ${selectedPatientId === p.id ? 'bg-blue-50/60' : ''}`}
                onClick={() => onSelect?.(p.id)}
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
                      onEdit?.(p.id)
                    }}
                    className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {patients.length === 0 ? (
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
  )
}

