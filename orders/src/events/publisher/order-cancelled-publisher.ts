import { Subjects, Publisher, OrderCancelledEvent } from '@ahttickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
