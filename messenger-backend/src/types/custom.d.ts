import { Express } from "express-serve-static-core";
import { Message } from "@prisma/client";
import { Socket } from "socket.io";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

type MessageWithSender = Message & {sender: boolean};

export interface CustomSocket extends Socket {
  userId?: string;
}
