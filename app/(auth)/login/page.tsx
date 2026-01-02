"use client";

import { useActionState } from "react";
import { loginAction } from "./actions"; // Import action yg baru dibuat
import { KeyRound, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  // Hook untuk handle Server Action state (error/loading)
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-coffee uppercase tracking-widest">
          Admin<span className="text-gold-accent">Portal</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Silakan login untuk mengelola konten.</p>
      </div>

      <form action={action} className="space-y-6">
        {/* Error Alert */}
        {state?.error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2">
            ⚠️ {state.error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              name="username"
              type="text" 
              placeholder="Masukkan username"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-accent/20 focus:border-gold-accent outline-none font-bold text-coffee placeholder:font-normal placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Password</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-accent/20 focus:border-gold-accent outline-none font-bold text-coffee placeholder:font-normal placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>

        <button 
          disabled={isPending}
          type="submit" 
          className="w-full bg-coffee text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Masuk Dashboard"}
        </button>
      </form>
    </div>
  );
}