
export type TDialogue = {
  users: string[];
  messages: TMessage[] | [];
}

export type TMessage = {
  from: string;
  to: string;
  dialogueId: string;
  text: string;
  createdAt: Date;
  read: boolean
}