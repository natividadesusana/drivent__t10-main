import bookingService from '../../src/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';
import { getBookingReturn } from '../factories/booking-factory';

describe('getBooking function', () => {
  it('should return the booking for the given user id', async () => {
    const userId = 1;
    const booking = getBookingReturn();

    jest.spyOn(bookingRepository, 'findByUserId').mockResolvedValue(booking);

    const result = await bookingService.getBooking(userId);

    expect(bookingRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(booking);
  });
});
