import Link from "next/link";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import ProductCard from "@/components/ProductCard";

type SearchParams = { kategori?: string; q?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { kategori, q } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: kategori, query: q }),
    getCategories(),
  ]);

  const activeCategoryName = categories.find((c) => c.slug === kategori)?.name;

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 via-green-600 to-lime-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Taze ürünler, kapına kadar 🚴
          </h1>
          <p className="text-white/90 max-w-xl">
            Meyve, sebze, süt ürünleri ve daha fazlası. Sipariş ver, kapıda öde.
          </p>

          <form action="/" className="max-w-md">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Ürün ara... (örn. domates)"
              className="w-full rounded-full px-5 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-lg"
            />
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              !kategori
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-gray-700 border-gray-200 hover:border-emerald-400"
            }`}
          >
            Tümü
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/?kategori=${c.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                kategori === c.slug
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-gray-700 border-gray-200 hover:border-emerald-400"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {q ? `"${q}" için sonuçlar` : activeCategoryName ?? "Tüm Ürünler"}
          <span className="text-gray-400 font-normal"> · {products.length} ürün</span>
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500 py-10 text-center">
            Aradığınız kriterlere uygun ürün bulunamadı.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
