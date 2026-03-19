export interface IUserData {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface IMessages {
  messageId: string;
  messageFrom: string;
  messageTo: string;
  content: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  formattedDate: string;
  status: string;
}
export interface IAllNotify {
  _id: string;
  messageId: string;
  senderName: string;
  messageFrom: string;
  messageTo: string;
  content: string;
  avatar: string;
  createdAt: string;
}
