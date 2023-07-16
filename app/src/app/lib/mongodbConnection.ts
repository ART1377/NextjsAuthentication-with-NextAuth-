import { hash, compare } from "bcryptjs";
import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URL as string);
  return client;
}

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}
export async function verifyPassword(password: string, hashedPassword: any) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
