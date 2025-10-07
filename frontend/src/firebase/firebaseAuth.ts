import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signInAnonymously,
  type User,
} from "firebase/auth";
import { eventModel } from "../models/EventModel";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign up
export async function signUp(email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;
  if (!user) throw new Error("No user returned");
  eventModel.setuserId(user.uid);
  return user;
}

// Sign in
export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;
  if (!user) throw new Error("No user returned");
  eventModel.setuserId(user.uid);
  return user;
}

// Google sign-in
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  eventModel.setuserId(result.user.uid);
  return result.user;
}

// GitHub sign-in
export async function signInWithGithub() {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);
  eventModel.setuserId(result.user.uid);
  return result.user;
}

// Anonymous sign-in
export async function signInWithAnonymous() {
  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;
  if (!user) throw new Error("No user returned");
  eventModel.setuserId(user.uid);
  return user;
}
