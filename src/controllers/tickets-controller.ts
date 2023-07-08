import { Response, Request } from 'express';
import * as ticketService from '../services/tickets-service/index';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { CreateTicket } from '@/protocols';

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const ticket = await ticketService.getTicketsTypes();
    res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const ticket = await ticketService.getUserTicket(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const data = req.body as CreateTicket;
  const userId = req.userId;
  try {
    const ticket = await ticketService.createTicket(data, userId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send({
        message: error.message,
      });
    }
    if (error.name === 'RequestError') {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}