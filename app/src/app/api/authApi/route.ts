import { connectToDatabase, hashPassword } from "@/app/lib/mongodbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;
  if (
    !email ||
    !password ||
    !email.includes("@") ||
    password.trim().length < 6
  ) {
    return NextResponse.json({ message: "Invalid Input" }, { status: 422 });
    // return new Response(JSON.stringify({ message: 'Invalid Input' }), {
    //   status: 422,
    // });
  }
  const client = await connectToDatabase();
  const db = client.db();
  const userCollection = db.collection("user");

  const existingUser = await userCollection.findOne({ email: email });
  if (existingUser) {
    return NextResponse.json(
      { message: "user already exist" },
      { status: 422 }
    );
  }

  const hashedPassword = await hashPassword(password);

  userCollection.insertOne({
    email: email,
    password: hashedPassword,
  });

  return NextResponse.json(
    { message: "Created User", email, password },
    { status: 201 }
  );
  // return new Response(JSON.stringify({ message: 'Created User', email, password }), {
  //   status: 201,
  // });
}
