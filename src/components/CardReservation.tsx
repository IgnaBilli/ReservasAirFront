import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import EventIcon from '@mui/icons-material/Event';
import FlightClassIcon from '@mui/icons-material/FlightClass';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CardReservationProps } from '@/interfaces';

function CardReservation({ reservation }: CardReservationProps) {
  return (
    <div className="flex border-[1px] justify-between border-[#939393] py-12 px-8 gap-16 rounded-[20px] min-h-[251px]">
      <div className="flex flex-col gap-8 text-[#5C6A7F]">
        <div className='flex gap-1 items-center font-bold'>
          <AirplanemodeActiveIcon style={{rotate: '90deg'}}/>
          <p className='text-[24px]'>Reserva #{String(reservation.reservationId).padStart(8, '0')}</p>
        </div>
        <div className="flex gap-26">
          <div className='flex gap-2 items-center text-[#5C6A7F] '>
            <EventIcon/>
            <div className='flex flex-col font-semibold text-[16px]'>
              <p>Fecha de Reserva</p>
              <p>{new Date(reservation.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className='flex gap-2 items-center text-[#5C6A7F]'>
            <FlightClassIcon/>
            <div className='flex flex-col font-semibold text-[16px]'>
              <p>Asiento</p>
              <p>{reservation.seatNumber}</p>
            </div>
          </div>
          <div className='flex gap-2 items-center text-[#5C6A7F]'>
            <CreditCardIcon/>
            <div className='flex flex-col font-semibold text-[16px]'>
              <p>Estado</p>
              <p>{reservation.status === "PAID" ? "Pagado" : "Cancelado"}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-end mb-4">
          {reservation.status === "PAID" ? (
            <span className="bg-green-600 text-white px-10 py-2 rounded-full font-bold">Pagado</span>
          ) : (
            <span className="bg-red-600 text-white px-10 py-2 rounded-full font-bold">Cancelado</span>
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <button className='flex items-center justify-between bg-[#E5E5E5] px-4 py-2 rounded-xl font-bold w-full'>
            Modificar Asiento
            <ArrowForwardIcon/>
          </button>
          {reservation.status !== "CANCELLED" && (
            <button className='flex gap-1 items-center justify-between bg-red-400 px-4 py-2 rounded-xl font-bold w-full text-white'>
              Cancelar (Reembolsar)
              <ArrowForwardIcon/>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardReservation
