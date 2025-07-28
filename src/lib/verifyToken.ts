import { adminAuth } from "./firebaseAdmin";

export async function verifyFirebaseToken(token?: string) {
  if (!token) throw new Error('No token provided');
  return await adminAuth.verifyIdToken(token);
}
