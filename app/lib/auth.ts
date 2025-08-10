import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Types for TypeScript support
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export interface Session {
  user?: SessionUser;
  expires: string;
}

// Get the current session on the server
export async function auth() {
  const session = await getServerSession(authOptions);
  return session;
}

// Check if the current user is authenticated
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

// Check if the current user is an admin
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

// Helper function to use in client components
export function isAdminUser(user?: SessionUser | null) {
  return user?.role === "admin";
}

// Hardcoded admin email for client-side checks
export const ADMIN_EMAIL = "your-secure-email@example.com";
