import { prisma } from '@/config';
import { CreateParams, UpdateParams } from '@/protocols';

async function create({ roomId, userId }: CreateParams) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function updateBooking({ id, userId, roomId }: UpdateParams) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      userId,
      roomId,
    },
    update: {
      roomId,
    },
  });
}

const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  updateBooking,
};

export default bookingRepository;
