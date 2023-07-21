import bookingService from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';
import roomRepository from '@/repositories/room-repository';
import { notFoundError } from '@/errors';
import {
  getBookingReturn,
  findRoomByIdReturn,
  findTicketByEnrollmentIdReturn,
  findBookingByRoomIdReturn,
  enrollmentWithAddressReturn,
} from '../../tests/factories';

describe('getBooking function', () => {
  it('should return the booking for the given user id', async () => {
    const userId = 1;
    const booking = getBookingReturn();
    jest.spyOn(bookingRepository, 'findByUserId').mockResolvedValue(booking);
    const result = await bookingService.getBooking(userId);
    expect(bookingRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(booking);
  });

  it('should throw notFoundError if the booking for the given user id is not found', async () => {
    const userId = 1;
    jest.spyOn(bookingRepository, 'findByUserId').mockResolvedValue(null);
    await expect(bookingService.getBooking(userId)).rejects.toEqual(notFoundError());
    expect(bookingRepository.findByUserId).toHaveBeenCalledWith(userId);
  });
});

describe('bookingRoomById function', () => {
  it('should create a booking for the given user and room', async () => {
    const userId = 1;
    const roomId = 1;
    const booking = getBookingReturn();

    jest.spyOn(bookingService, 'checkEnrollmentTicket').mockResolvedValue(undefined);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockResolvedValue(findTicketByEnrollmentIdReturn());

    jest.spyOn(bookingService, 'checkValidBooking').mockResolvedValue(undefined);
    jest.spyOn(roomRepository, 'findById').mockResolvedValue(findRoomByIdReturn());
    jest.spyOn(bookingRepository, 'findByRoomId').mockResolvedValue(findBookingByRoomIdReturn());

    jest.spyOn(bookingRepository, 'create').mockResolvedValue(booking);

    const result = await bookingService.bookingRoomById(userId, roomId);

    expect(bookingRepository.create).toHaveBeenCalledWith({ userId, roomId });
    expect(result).toEqual(booking);
  });
});
