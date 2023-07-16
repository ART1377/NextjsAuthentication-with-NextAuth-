import {
  connectToDatabase,
  hashPassword,
  verifyPassword,
} from "@/app/lib/mongodbConnection";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { options } from "../auth/[...nextauth]/options";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { oldPassword, newPassword } = body;

  const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { message: "you are not authenticated" },
        { status: 401 }
      );
    }

  const userEmail = session?.user?.email;

  const client = await connectToDatabase();
  const collection = client.db().collection("user");
  const user = await collection.findOne({ email: userEmail });
  if (!user) {
    client.close();
    return NextResponse.json(
      {
        message: "user not found you can't change password",
      },
      { status: 404 }
    );
  }

  const passwordsAreEqual = await verifyPassword(oldPassword, user?.password);

  if (!passwordsAreEqual) {
    client.close();

    return NextResponse.json(
      { message: "password does not match" },
      { status: 403 }
    );
  }
  const updatedPassword = await hashPassword(newPassword);
  const result = await collection.updateOne(
    { email: userEmail },
    { $set: { password: updatedPassword } }
  );
  client.close();
  return NextResponse.json(
    { message: "password changed successfully" },
    { status: 200 }
  );
}
