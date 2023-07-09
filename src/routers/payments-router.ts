import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment, getPaymentsByTicket } from '@/controllers/payments-controller';
import { paymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter.use(authenticateToken);
paymentsRouter.get('/', getPaymentsByTicket);
paymentsRouter.post('/process', validateBody(paymentSchema), createPayment);

export { paymentsRouter };
