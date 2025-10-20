import type { Request, Response, NextFunction } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { admin } from "./firebaseAdmin";

export async function verifyFirebaseToken(
  req: Request & { firebaseUser?: DecodedIdToken },
  res: Response,
  next: NextFunction,
) {
  try {
    const auth = req.header("Authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
    if (!token)
      return res.status(401).json({ error: "Missing Authorization header" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
