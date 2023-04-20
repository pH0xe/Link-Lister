import { MessageType } from '../enums/message-type.enum';

export class Message {
  id!: MessageType;
  data?: any;

  constructor(obj: Partial<Message>) {
    Object.assign(this, obj);
  }
}
