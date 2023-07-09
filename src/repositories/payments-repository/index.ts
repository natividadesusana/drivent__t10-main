import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentBody } from '@/protocols';

export async function getPaymentsByTicket(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

export async function createPayment(data: PaymentBody, price: number): Promise<Payment> {
  return prisma.payment.create({
    data: {
      ticketId: data.ticketId,
      value: price,
      cardIssuer: data.cardData.issuer,
      cardLastDigits: data.cardData.number.toString().slice(-4),
    },
  });
}

export async function getPriceByTicket(ticketId: number) {
  const result = await prisma.ticketType.findUnique({
    where: { id: ticketId },
  });

  return result?.price;
}

export async function update(userId: number) {
  return prisma.ticket.updateMany({
    where: {
      Enrollment: { userId },
    },
    data: { status: 'PAID' },
  });
}

export async function validateTicket(ticketId: number) {
  const userTicket = await prisma.ticket.findFirst({
    where: { id: ticketId },
    include: { Enrollment: true },
  });

  return userTicket?.Enrollment.userId;
}
