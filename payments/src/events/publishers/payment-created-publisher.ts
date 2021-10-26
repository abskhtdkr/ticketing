import { Subjects, Publisher, PaymentCreatedEvent } from '@ahttickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
