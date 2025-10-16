import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signInAnonymously,
  type User,
} from "firebase/auth";

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
  return user;
}

// Google sign-in
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// GitHub sign-in
export async function signInWithGithub() {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// Anonymous sign-in
export async function signInWithAnonymous() {
  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;
  if (!user) throw new Error("No user returned");
  return user;
}

let authListenerInitialized = false;

/**
 * Pass the model so this module stays decoupled.
 */
export function initAuthListener(model: {
  setuserId: (id: string | null) => void;
  setUsername?: (name: string | null) => void;
}) {
  if (authListenerInitialized) return;
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      model.setuserId(user.uid);

      // ✅ New: clean up and prettify fallback username
      let fallbackName: string | undefined = user.displayName || undefined;

      if (!fallbackName && user.email) {
        // Extract part before "@"
        const emailName = user.email.split("@")[0];
        // Replace "." or "_" with spaces and capitalize each part
        fallbackName = emailName
          .replace(/[._]+/g, " ")
          .split(" ")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(" ");
      }

      if (model.setUsername) model.setUsername(fallbackName || "Anonymous");
    } else {
      model.setuserId(null);
      if (model.setUsername) model.setUsername(null);
    }
  });
  authListenerInitialized = true;
}
