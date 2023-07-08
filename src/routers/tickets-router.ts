import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import * as ticketsControllers from '@/controllers/tickets-controller';
import { ticketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.use(authenticateToken);
ticketsRouter.get('/types', ticketsControllers.getTicketsTypes);
ticketsRouter.get('/', ticketsControllers.getUserTicket);
ticketsRouter.post('/', validateBody(ticketSchema), ticketsControllers.createTicket);

export { ticketsRouter };
