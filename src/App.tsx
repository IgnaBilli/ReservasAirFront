import { Route, Routes } from 'react-router-dom'
import './App.css'
import SeatSelect from './pages/SeatSelect'

function App() {
  return (
    <>
      <Routes>
        <Route path="/asd" element={<SeatSelect />} />
        <Route path="/selectseat" element={<SeatSelect />} />
      </Routes>
    </>
  )
}

export default App
