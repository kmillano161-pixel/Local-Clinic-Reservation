import Cards from '../components/ui/Cards'
import { FaCalendarAlt } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'
import { MdPendingActions } from 'react-icons/md'
import { GrMoney } from 'react-icons/gr'
import AppoinmentTable from './AppoinmentTable'
import Calendar from '../components/ui/Calendar'

function Dashboards() {
  return (
    <div className="h-full min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-col sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-2xl font-bold text-left">
            <span className="text-blue-900">Hello Kenneth</span>
          </h1>

          <div className="flex items-center gap-3">
            <p className="text-sm sm:text-base text-slate-700">
              you have 12 appoinment schedule today
            </p>
            <button className="shrink-0 rounded-3xl w-full sm:w-40 border bg-blue-400 text-white px-4 py-2 font-medium hover:bg-blue-500 transition">
              Add Patients
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <Cards icon={<FaCalendarAlt size={28} />} title="Total Appoinment" number="12" />
          <Cards icon={<ImProfile size={28} />} title="Active Patients" number="12" />
          <Cards icon={<MdPendingActions size={28} />} title="Pending Result" number="12" />
          <Cards icon={<GrMoney size={28} />} title="Revenue" number="1200" />
        </div>

        {/* Main content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Schedule</h2>
              <p className="text-sm text-gray-600">
                Select a day to view appointments.
              </p>
            </div>

            <Calendar
              initialDate={new Date()}
              eventsByDate={{
                [new Date().toISOString().slice(0, 10)]: [
                  { title: 'Today appointment', meta: 'Demo' },
                ],
              }}
              onSelectDate={(iso) => {
                console.log('Selected date:', iso)
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <AppoinmentTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboards

