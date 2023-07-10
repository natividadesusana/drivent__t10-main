import { Payment } from '@prisma/client';
import { PaymentBody } from '@/protocols';
import { notFoundError, unauthorizedError } from '@/errors';
import * as repositoryPayment from '@/repositories/payments-repository';
import * as repositoryTicket from '@/repositories/tickets-repository';

export async function getPaymentsByTicket(ticketId: number, userId: number): Promise<Payment> {
  if (!ticketId) throw notFoundError();

  const tickets = await repositoryTicket.validationTicket(ticketId);
  if (!tickets) throw notFoundError();

  const userTicket = await repositoryPayment.validateTicket(ticketId);
  if (userTicket !== userId) throw unauthorizedError();

  return repositoryPayment.getPaymentsByTicket(ticketId);
}

export async function createPayment(body: PaymentBody, userId: number): Promise<Payment> {
  const ticketId = body.ticketId;

  const tickets = await repositoryTicket.validationTicket(ticketId);
  if (!tickets) throw notFoundError();

  const userTicket = await repositoryPayment.validateTicket(ticketId);
  if (userTicket !== userId) throw unauthorizedError();

  const price = await repositoryPayment.getPriceByTicket(tickets.ticketTypeId);
  if (price) {
    await repositoryPayment.createPayment(body, price);
    await repositoryPayment.update(userId);
  }

  return await repositoryPayment.getPaymentsByTicket(ticketId);
}
