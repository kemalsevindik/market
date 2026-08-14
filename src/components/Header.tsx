import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Header() {
  const session = await auth();

  let cartCount = 0;
  if (session?.user?.id) {
    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
    });
    cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  }

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xl font-bold whitespace-nowrap flex items-center gap-2 hover:opacity-90"
        >
          <span className="text-2xl">🥬</span>
          <span>Taze Market</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3 text-sm font-medium">
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-full hover:bg-white/15"
            >
              Yönetim
            </Link>
          )}
          {session?.user && (
            <Link
              href="/siparislerim"
              className="px-3 py-1.5 rounded-full hover:bg-white/15"
            >
              Siparişlerim
            </Link>
          )}
          <Link
            href="/sepet"
            className="relative px-3 py-1.5 rounded-full hover:bg-white/15 flex items-center gap-1"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Sepet</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="px-3 py-1.5 rounded-full hover:bg-white/15 cursor-pointer">
                Çıkış ({session.user.name})
              </button>
            </form>
          ) : (
            <>
              <Link href="/giris" className="px-3 py-1.5 rounded-full hover:bg-white/15">
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="bg-white text-green-700 px-4 py-1.5 rounded-full font-semibold hover:bg-green-50 shadow-sm"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
