import * as repositoryTicket from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { TicketType } from '@prisma/client';
import { CreateTicket, TicketWithTicketType } from '@/protocols';
import { notFoundError } from '@/errors';

export async function getTicketsTypes() {
  const ticket = await repositoryTicket.getTicketsTypes();
  return ticket;
}

export async function getUserTicket(userId: number): Promise<TicketWithTicketType> {
  return searchAndReturnTicket(userId);
}

export async function createTicket(data: CreateTicket, userId: number): Promise<TicketWithTicketType> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  await repositoryTicket.createTicket(data, enrollment.id);
  return searchAndReturnTicket(userId);
}

async function searchAndReturnTicket(userId: number): Promise<TicketWithTicketType> {
  const ticket = await repositoryTicket.getUserTicket(userId);

  if (!ticket) {
    throw notFoundError();
  }

  const { id, status, ticketTypeId, enrollmentId, createdAt, updatedAt, TicketType } = ticket;

  if (!TicketType) {
    throw notFoundError();
  }

  const ticketType: TicketType = {
    id: TicketType.id,
    name: TicketType.name,
    price: TicketType.price,
    isRemote: TicketType.isRemote,
    includesHotel: TicketType.includesHotel,
    createdAt: TicketType.createdAt,
    updatedAt: TicketType.updatedAt,
  };

  const ticketWithTicketType: TicketWithTicketType = {
    id,
    status,
    ticketTypeId,
    enrollmentId,
    TicketType: ticketType,
    createdAt,
    updatedAt,
  };

  return ticketWithTicketType;
}
