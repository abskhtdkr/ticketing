import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@ahttickets/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listner = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listner, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listner.onMessage(data, msg);

  // Write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listner, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listner.onMessage(data, msg);

  // Write assertions to make sure ack function is called!
  expect(msg.ack).toHaveBeenCalled();
});
