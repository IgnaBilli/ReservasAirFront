import CardReservation from "@/components/CardReservation"
import { reservations } from "@/mocks/reservations";

const Reservations = () => {

  return (
    <div className="flex justify-center flex-col items-center text-black">
      <h1 className="text-[30px] font-semibold text-[#000000] mt-7">Mis Reservas</h1>
      
      <div className="flex flex-col gap-4 mt-8">
        {reservations.map(res => (
            <CardReservation key={res.reservationId} reservation={res} />
        ))}
      </div>

    </div>
  )
}

export default Reservations