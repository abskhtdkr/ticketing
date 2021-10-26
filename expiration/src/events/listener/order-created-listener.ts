import { Listener, OrderCreatedEvent, Subjects } from '@ahttickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queue/expiration';

export class OrderCreatedListenr extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log('Waiting this many miliseconds to process the job:', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
