import { useMemo, useState } from "react";


function StatusPill({ status }) {
  const cls =
    status === "successful"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "failed"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${cls}`}
    >
      {status}
    </span>
  );
}

function AppoinmentTable() {
  const [query, setQuery] = useState("");

  const appoinment = useMemo(
    () => [
      { name: "Kenneth", time: "2:30", status: "pending", button: "View record" },
      { name: "John", time: "5:30", status: "successful", button: "View record" },
      { name: "Millano", time: "7:30", status: "failed", button: "View record" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return appoinment;
    return appoinment.filter((a) =>
      [a.name, a.time, a.status].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [appoinment, query]);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Appointments</h2>
            <p className="text-gray-600 text-sm mt-1">Manage and review today’s appointment statuses.</p>
          </div>

          {/* Search (top-right on desktop, stacked on mobile) */}
          <div className="w-full sm:w-[320px]">
            <label className="block text-sm text-gray-600 mb-2" htmlFor="appointment-search">
              Search
            </label>
            <div className="relative">
              <input
                id="appointment-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Search by name, time, status..."
              />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> appointments
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="text-left text-sm text-gray-600 bg-[#8d9195]">
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filtered.map((a, idx) => (
                  <tr key={`${a.name}-${a.time}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{a.name}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-sm">{a.time}</td>
                    <td className="px-4 py-4">
                      <StatusPill status={a.status} />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Viewing record for ${a.name} at ${a.time}`)
                        }}
                        className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        {a.button}
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppoinmentTable;


