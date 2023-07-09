import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import * as paymentService from '@/services/payments-service';

export async function getPaymentsByTicket(req: AuthenticatedRequest, res: Response) {
  const ticketId = req.query.ticketId;
  const { userId } = req;

  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const tickets = await paymentService.getPaymentsByTicket(Number(ticketId), userId);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const body = req.body;
  const { userId } = req;

  try {
    const tickets = await paymentService.createPayment(body, userId);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
