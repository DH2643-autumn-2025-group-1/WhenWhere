import dotenv from "dotenv";
dotenv.config();

import { initializeApp, cert, getApps, getApp, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { Request, Response, NextFunction } from "express";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !rawPrivateKey) {
  throw new Error("Missing Firebase Admin env vars");
}
const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

const app: App = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

export const db = getFirestore(app);
export const auth = getAuth(app);

export async function verifyFirebaseToken(
  req: Request & { user?: DecodedIdToken },
  res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing Authorization: Bearer <token>" });
    }
    const idToken = header.substring("Bearer ".length);
    const decoded = await auth.verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}