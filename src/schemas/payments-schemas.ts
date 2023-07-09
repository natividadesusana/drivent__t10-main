import Joi from 'joi';
import { CardData, PaymentBody } from '@/protocols';

export const paymentSchema = Joi.object<PaymentBody>({
  ticketId: Joi.number().required(),
  cardData: Joi.object<CardData>({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string()
      .regex(/^(0?[1-9]|1[0-2])\/\d{4}$/)
      .required(),
    cvv: Joi.number().required(),
  }),
});
