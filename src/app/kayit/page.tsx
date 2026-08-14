import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function KayitPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <span className="text-3xl">🥕</span>
          <h1 className="text-2xl font-bold mt-2">Kayıt Ol</h1>
          <p className="text-sm text-gray-500 mt-1">Hemen üye ol, alışverişe başla.</p>
        </div>

        <RegisterForm />

        <p className="text-sm text-gray-600 mt-5 text-center">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="text-emerald-700 font-semibold">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
