import { Express } from "express-serve-static-core";
import { Message } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

type MessageWithSender = Message & {sender: boolean};