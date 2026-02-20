"use server";


import { getAuth } from "../better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async (data: SignUpFormData) => {
  try {
    const auth = await getAuth();
    if (!auth) {
      return { success: false, message: "Could not initialize auth" };
    }

    const response = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    if (!response) {
      return { success: false, message: "Sign up failed" };
    }

    await inngest.send({
      name: "app/user.created",
      data: { name: data.name, email: data.email },
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("sign up failed,", error);
    return { success: false, error: "Sign up failed" };
  }
};

export const signOut = async () => {
  try {
    const auth = await getAuth();
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    console.error("sign out failed", error);
    return { success: false, message: "Could not sign out" };
  }
};

export const signInWithEmail = async (data: SignInFormData) => {
  try {
    const auth = await getAuth();
    if (!auth) {
      return { success: false, message: "Could not initialize auth" };
    }

    const response = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(), // required for session cookie
    });

    if (!response) {
      return { success: false, message: "Sign in failed" };
    }

    return { success: true, data: response };
  } catch (error) {
    console.error("sign in failed,", error);
    return { success: false, error: "Sign in failed" };
  }
};
