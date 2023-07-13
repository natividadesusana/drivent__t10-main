import { AuthenticatedRequest } from '@/middlewares';
import { Response, NextFunction } from 'express';
import hotelsService from '@/services/hotels-service';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelsWithRooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
