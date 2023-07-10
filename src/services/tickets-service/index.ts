import { TicketType } from '@prisma/client';
import * as repositoryTicket from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { CreateTicket, TicketWithTicketType } from '@/protocols';
import { notFoundError } from '@/errors';

export async function getTicketsTypes() {
  return repositoryTicket.getTicketsTypes();
}

export async function getUserTicket(userId: number): Promise<TicketWithTicketType> {
  const ticket = await repositoryTicket.getUserTicket(userId);
  return validateTicket(ticket);
}

export async function createTicket(data: CreateTicket, userId: number): Promise<TicketWithTicketType> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  await repositoryTicket.createTicket(data, enrollment.id);
  return getUserTicket(userId);
}

function validateTicket(ticket: TicketWithTicketType): TicketWithTicketType {
  if (!ticket || !ticket.TicketType) {
    throw notFoundError();
  }

  const { id, status, ticketTypeId, enrollmentId, createdAt, updatedAt, TicketType } = ticket;

  const ticketType: TicketType = {
    ...TicketType,
  };

  return {
    id,
    status,
    ticketTypeId,
    enrollmentId,
    TicketType: ticketType,
    createdAt,
    updatedAt,
  };
}
