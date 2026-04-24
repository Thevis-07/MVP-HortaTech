// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const FIREBASE_API_KEY = requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
const FIREBASE_AUTH_DOMAIN = requireEnv(
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
);
const FIREBASE_DATABASE_URL = requireEnv(
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
);
const FIREBASE_PROJECT_ID = requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
const FIREBASE_STORAGE_BUCKET = requireEnv(
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
);
const FIREBASE_MESSAGING_SENDER_ID = requireEnv(
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
);
const FIREBASE_APP_ID = requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
const FIREBASE_AUTH_EMAIL = requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_EMAIL", process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMAIL);
const FIREBASE_AUTH_PASSWORD = requireEnv(
  "NEXT_PUBLIC_FIREBASE_AUTH_PASSWORD",
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_PASSWORD,
);

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const database = getDatabase(app);

export async function signIn() {
  return signInWithEmailAndPassword(auth, FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD);
}

export default app;
