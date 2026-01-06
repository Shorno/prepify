"use server";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { auth } from "@/lib/auth";

export type UserRole =
  | "student"
  | "moderator"
  | "admin"

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function checkAuth() {
  return getSession();
}

// For server actions - throws and redirects if unauthorized
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}

// For server actions - throws and redirects if role doesn't match
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const userRole = session.user.role as UserRole;

  if (!allowedRoles.includes(userRole)) {
    return unauthorized();
  }

  return session;
}

export async function requireAdmin() {
  return requireRole(["admin"]);
}

export async function requireModerator() {
  return requireRole(["moderator"]);
}



export async function checkRole(allowedRoles: UserRole[]) {
  const session = await getSession();
  if (!session) return null;

  const userRole = session.user.role as UserRole;
  return allowedRoles.includes(userRole) ? session : null;
}
