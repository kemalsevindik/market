"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder, CheckoutState } from "@/actions/orders";

const initialState: CheckoutState = {};

export default function CheckoutForm() {
  const [state, formAction, pending] = useActionState(createOrder, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/siparislerim");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
      <h2 className="font-semibold text-lg">Sipariş Bilgileri</h2>

      {state.error && (
        <p className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <textarea
        name="address"
        placeholder="Teslimat adresi"
        required
        rows={3}
        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Telefon"
        required
        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <textarea
        name="note"
        placeholder="Sipariş notu (opsiyonel)"
        rows={2}
        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <p className="text-sm text-gray-500 flex items-center gap-1.5">
        <span>💵</span> Ödeme: Kapıda ödeme
      </p>

      <button
        type="submit"
        disabled={pending}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg shadow-sm"
      >
        {pending ? "Sipariş veriliyor..." : "Siparişi Onayla"}
      </button>
    </form>
  );
}
