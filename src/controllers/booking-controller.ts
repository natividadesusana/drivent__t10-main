import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import bookingService from '@/services/booking-service';
import httpStatus from 'http-status';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room,
    });
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  if (!roomId) return res.sendStatus(httpStatus.NOT_FOUND);

  try {
    const booking = await bookingService.bookingRoomById(userId, Number(roomId));
    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    if (error.name === 'CannotBookingError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const bookingId = Number(req.params.bookingId);
  const { roomId } = req.body;
  const { userId } = req;

  try {
    if (!roomId || !bookingId) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const booking = await bookingService.updateBookingRoomById(userId, Number(roomId));
    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    if (error.name === 'CannotBookingError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
