import { Ticket } from '@prisma/client';
import { CreateTicket, TicketWithTicketType } from '@/protocols';
import { prisma } from '@/config';

export async function getTicketsTypes() {
  return await prisma.ticketType.findMany();
}

export async function getUserTicket(userId: number): Promise<TicketWithTicketType> {
  return await prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId: userId,
      },
    },
    include: {
      TicketType: true,
      Enrollment: true,
    },
  });
}

export async function createTicket(data: CreateTicket, enrollmentId: number): Promise<Ticket> {
  const ticketTypeId: number = data.ticketTypeId;

  return prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
    },
  });
}

export async function validationTicket(ticketId: number): Promise<Ticket> {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });
}
