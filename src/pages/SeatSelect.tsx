import { useEffect, useState } from 'react';
import { AircraftType } from '@/interfaces';
import HistoryIcon from '@mui/icons-material/History';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { SeatMap } from '@/components/SeatPicker';

const SeatSelect = () => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const aircraft: AircraftType = "A330";

  useEffect(() => {
    console.log(selectedSeats); //Es numerico unicamente!
  }, [selectedSeats]);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className='flex items-center justify-between mt-7'>
        <h1 className='text-[30px] font-semibold text-[#000000]'>Seleccion de Asiento</h1>

      </div>
      <div className='flex gap-15 mt-6 border-[1px] border-[#939393] p-12 px-20 rounded-[20px] relative mx-4'>
        <div className='flex absolute text-[#000000] top-[-65px] right-[5px] border-[1px] border-[#939393] p-2 rounded-[5px] items-center gap-2 font-bold cursor-pointer'>
          <HistoryIcon />
          <p className='flex items-center'>Mis Reservas</p>
        </div>
        <div className='text-[#3A3A3A] text-[18px] font-semibold flex items-center gap-2 text-left'>
          <FlightTakeoffIcon />
          <p>Vuelo AA1234</p>
        </div>
        <div className='text-[#3A3A3A] text-[16px] font-semibold flex flex-col items-start text-left'>
          <p>Buenos Aires (EZE)</p>
          <p className='font-normal'>14:30</p>
        </div>
        <div className='text-[#3A3A3A] text-[16px] font-semibold flex flex-col items-start text-left'>
          <p>Mendoza (SAME)</p>
          <p className='font-normal'>16:30</p>
        </div>
        <div className='text-[#3A3A3A] text-[16px] font-semibold flex flex-col items-start text-left'>
          <p>Aeronave</p>
          <p className='font-normal '>Boeing 737-800</p>
        </div>
      </div>

      <div className="p-6">
        <SeatMap
          aircraft={aircraft}
          occupied={[1,70,2,6,7,8,9,10]}
          maxSelectable={1}
          onChange={setSelectedSeats}
        />
      </div>
    </div>
  )
}

export default SeatSelect