import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/giris");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Yönetim Paneli</h1>
      <nav className="flex gap-2 mb-6 bg-white border border-gray-100 rounded-full p-1.5 w-fit text-sm shadow-sm">
        <Link
          href="/admin"
          className="px-4 py-1.5 rounded-full font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Genel Bakış
        </Link>
        <Link
          href="/admin/urunler"
          className="px-4 py-1.5 rounded-full font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Ürünler
        </Link>
        <Link
          href="/admin/kategoriler"
          className="px-4 py-1.5 rounded-full font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Kategoriler
        </Link>
        <Link
          href="/admin/siparisler"
          className="px-4 py-1.5 rounded-full font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Siparişler
        </Link>
      </nav>
      {children}
    </div>
  );
}
