import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { paymentRequiredError } from '@/errors/payment-required-error';

async function listHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status !== 'PAID') {
    throw paymentRequiredError();
  }
}

async function getHotels(userId: number) {
  await listHotels(userId);

  const hotels = await hotelRepository.findHotels();
  if (!hotels || hotels.length === 0) {
    throw notFoundError();
  }
  return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);

  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel || hotel.Rooms.length === 0) {
    throw notFoundError();
  }
  return hotel;
}

const hotelService = {
  listHotels,
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
