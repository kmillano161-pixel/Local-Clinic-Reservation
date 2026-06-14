import React from 'react'

export default function KpiCard({ icon, title, number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 h-24 sm:h-28">
      <div className="text-blue-600 text-2xl w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        {icon ?? null}
      </div>
      <div className="flex-1">
        <p className="text-gray-500 text-sm">{title ?? ''}</p>
        <h2 className="text-gray-900 text-2xl font-semibold leading-none mt-1">
          {number ?? ''}
        </h2>
      </div>
    </div>
  )
}

