import React from 'react'

export default function StatusPill({ status }) {
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

