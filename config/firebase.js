import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(new URL("../firebase-service-account.json", import.meta.url))
);

initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth();