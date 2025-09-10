import { useEffect, useState } from 'react';
import { AircraftType } from '@/interfaces';
import HistoryIcon from '@mui/icons-material/History';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { SeatMap } from '@/components/SeatPicker';

const SeatSelect = () => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const aircraft: AircraftType = "B737";

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
      {/* <div className='mt-5 flex gap-3 text-left'>
        <div className='text-black flex items-center gap-2'>
            <div className='min-w-[24px] min-h-[24px] bg-[#D9D9D9] rounded-[5px]'></div>
            <p className='text-[16px]'>Economica ($450)</p>
        </div>
        <div className='text-black flex items-center gap-2'>
            <div className='min-w-[24px] min-h-[24px] bg-[#A3B0BD] rounded-[5px]'></div>
            <p className='text-[16px]'>Business ($600)</p>
        </div>
        <div className='text-black flex items-center gap-2'>
            <div className='min-w-[24px] min-h-[24px] bg-[#ACA7BE] rounded-[5px]'></div>
            <p className='text-[16px]'>Primera Clase ($750)</p>
        </div>
                <div className='text-black flex items-center gap-2'>
            <div className='min-w-[24px] min-h-[24px] bg-[#5C6A7F] rounded-[5px]'></div>
            <p className='text-[16px]'>Ocupado</p>
        </div>
        <div className='text-black flex items-center gap-2'>
            <div className='min-w-[24px] min-h-[24px] bg-[#FFE100] rounded-[5px]'></div>
            <p className='text-[16px]'>Reservado</p>
        </div>
        <div className='text-black flex items-center gap-2'>
            <div className='min-w-[24px] min-h-[24px] bg-[#74B5CD] rounded-[5px]'></div>
            <p className='text-[16px]'>Seleccionado</p>
        </div>
      </div> */}
      <div className="p-6">
        <SeatMap
          aircraft={aircraft}
          occupied={[1]}
          reserved={[2, 99]}
          maxSelectable={1}
          onChange={setSelectedSeats}
        />
        {/* Puedes mostrar los asientos seleccionados aquí si quieres */}
        <div className="mt-4">
          <h3>Seleccionados: {selectedSeats.join(", ")}</h3>
        </div>
      </div>
    </div>
  )
}

export default SeatSelect