import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

const serviceAccount = JSON.parse(
  readFileSync(resolve(process.cwd(), "firebase-adminsdk.json"), "utf-8")
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();
const db = getFirestore();

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone ? phone : undefined,
    });

    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      phone,
      role: "courier",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Driver successfully created.",
      uid: userRecord.uid,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
