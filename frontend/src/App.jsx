
import './App.css'
import Sidebar from './components/layout/Sidebar'
import Dashboards from './pages/Dashboards'
import Patients from './pages/Patients'

function App() {
  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <div className="shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 min-w-0 min-h-screen">
        <Patients />
        {/* Patients page placeholder (no routing in this project yet) */}
        {/* <Patients /> */}

      </main>
    </div>
  )
}

export default App

