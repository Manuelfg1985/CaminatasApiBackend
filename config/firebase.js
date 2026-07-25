import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Producción (Render): la credencial viene de una variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Desarrollo local: la credencial viene del archivo en disco
  serviceAccount = JSON.parse(
    readFileSync(new URL("../firebase-service-account.json", import.meta.url))
  );
}

initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth();