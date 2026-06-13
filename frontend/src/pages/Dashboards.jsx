
import Cards from '../components/ui/Cards'
import { FaCalendarAlt } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdPendingActions } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import AppoinmentTable from './AppoinmentTable';
import Calendar from '../components/ui/Calendar';


function Dashboards() {
  return (
    <div className='ml-11 bg-slate-100'>
      <h1 className="text-left font-bold"><span className='text-blue-900 '>Hello Kenneth</span></h1>
      <div className='flex justify-between mb-10'>
        <p>you have 12 appoinment schedule today</p>
        <button className="border rounded-3xl w-40 bg-blue-400 text-mist-100 mr-5">Add Patients</button>
      </div>

      <div className='flex flex-wrap gap-10'>
        <Cards
          icon={<FaCalendarAlt size={28} />}
          title="Total Appoinment"
          number="12"
        />

        <Cards
          icon={<ImProfile size={28} />}
          title="Active Patients"
          number="12"
        />

        <Cards
          icon={<MdPendingActions size={28} />}
          title="Pending Result"
          number="12"
        />

        <Cards
          icon={<GrMoney size={28} />}
          title="Revenue"
          number="1200"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
            <p className="text-sm text-gray-600">Select a day to view appointments.</p>
          </div>

          <Calendar
            initialDate={new Date()}
            eventsByDate={{
              [new Date().toISOString().slice(0, 10)]: [
                { title: 'Today appointment', meta: 'Demo' },
              ],
            }}
            onSelectDate={(iso) => {
              // Demo: hook into real data later
              console.log('Selected date:', iso)
            }}
          />
        </div>

        <div className="lg:col-span-2">
          <AppoinmentTable />
        </div>
      </div>

    </div>
  )
}

export default Dashboards

