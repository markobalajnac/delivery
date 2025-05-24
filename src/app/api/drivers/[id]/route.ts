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
  // Očekuje se da params bude Promise, await-uj ga:
  const params = await context.params;

  try {
    const docRef = db.collection("users").doc(params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ success: false, error: "Driver not found" }, { status: 404 });
    }

    const driverData = docSnap.data();

    return NextResponse.json({ success: true, driver: { id: docSnap.id, ...driverData } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
