import Link from "next/link";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        const { redirect } = await import("next/navigation");
        redirect("/giris?error=1");
      }
      throw err;
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <span className="text-3xl">🥬</span>
          <h1 className="text-2xl font-bold mt-2">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mt-1">Hesabına giriş yap ve alışverişe devam et.</p>
        </div>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
            E-posta veya şifre hatalı.
          </p>
        )}

        <form action={loginAction} className="flex flex-col gap-3">
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
            placeholder="Şifre"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow-sm mt-1"
          >
            Giriş Yap
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-5 text-center">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="text-emerald-700 font-semibold">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
