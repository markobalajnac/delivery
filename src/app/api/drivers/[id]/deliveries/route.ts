import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
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

const db = getFirestore();

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const driverId = params.id;

    const deliveriesSnapshot = await db
      .collection("users")
      .doc(driverId)
      .collection("deliveries")
      .orderBy("createdAt", "desc")
      .get();

    const deliveries = deliveriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(deliveries);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const driverId = params.id;
    const body = await request.json();

    const requiredFields = ["recipientName", "address", "packageDetails"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const deliveryRef = await db
      .collection("users")
      .doc(driverId)
      .collection("deliveries")
      .add({
        ...body,
        createdAt: new Date().toISOString(),
        status: "pending",
      });

    return NextResponse.json({ success: true, deliveryId: deliveryRef.id });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
