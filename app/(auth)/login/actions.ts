"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import * as bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Schema Validasi Input
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginAction(prevState: any, formData: FormData) {
  // 1. Validasi Input
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: "Input tidak valid." };
  }

  const { username, password } = result.data;

  // 2. Cari Admin di Database
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return { error: "Username atau password salah." };
  }

  // 3. Cek Password (Hash Comparison)
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return { error: "Username atau password salah." };
  }

  // 4. Create Session & Redirect
  await createSession(admin.id);
  
  // Redirect dilakukan di luar try/catch block jika memungkinkan, 
  // tapi di dalam Server Action, redirect() melempar error khusus NEXT_REDIRECT
  redirect("/admin");
}