"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerUser, RegisterState } from "@/actions/auth";

const initialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/giris");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && (
        <p className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <input
        type="text"
        name="name"
        placeholder="Ad Soyad"
        required
        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        type="email"
        name="email"
        placeholder="E-posta"
        required
        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        type="password"
        name="password"
        placeholder="Şifre (en az 6 karakter)"
        required
        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg shadow-sm mt-1"
      >
        {pending ? "Kaydediliyor..." : "Kayıt Ol"}
      </button>
    </form>
  );
}
