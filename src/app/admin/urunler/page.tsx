import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/actions/products";
import { getCategories } from "@/actions/categories";

export default async function AdminUrunlerPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getCategories(),
  ]);

  return (
    <div>
      <details className="mb-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <summary className="font-semibold cursor-pointer text-emerald-800">
          + Yeni Ürün Ekle
        </summary>
        <form action={createProduct} className="grid grid-cols-2 gap-3 mt-4">
          <input
            type="text"
            name="name"
            placeholder="Ürün adı"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            name="description"
            placeholder="Açıklama"
            className="border border-gray-300 rounded-lg px-3 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Fiyat"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            name="unit"
            placeholder="Birim (kg, adet, lt...)"
            defaultValue="adet"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            defaultValue={0}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            name="categoryId"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Kategori seç</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="imageUrl"
            placeholder="Görsel URL (opsiyonel)"
            className="border border-gray-300 rounded-lg px-3 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg col-span-2 shadow-sm"
          >
            Ürünü Ekle
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const updateWithId = updateProduct.bind(null, product.id);
          const deleteWithId = deleteProduct.bind(null, product.id);

          return (
            <form
              key={product.id}
              action={updateWithId}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-emerald-50 overflow-hidden flex items-center justify-center text-xl shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    "🛍️"
                  )}
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={product.name}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 flex-1 font-medium"
                />
                <label className="flex items-center gap-1.5 text-sm text-gray-600 shrink-0">
                  <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
                  Aktif
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <select
                  name="categoryId"
                  defaultValue={product.categoryId}
                  className="border border-gray-300 rounded-lg px-2 py-1.5"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={product.price}
                  className="border border-gray-300 rounded-lg px-2 py-1.5"
                  placeholder="Fiyat"
                />
                <input
                  type="text"
                  name="unit"
                  defaultValue={product.unit}
                  className="border border-gray-300 rounded-lg px-2 py-1.5"
                  placeholder="Birim"
                />
                <input
                  type="number"
                  name="stock"
                  defaultValue={product.stock}
                  className="border border-gray-300 rounded-lg px-2 py-1.5"
                  placeholder="Stok"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <input
                  type="text"
                  name="description"
                  defaultValue={product.description ?? ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5"
                  placeholder="Açıklama"
                />
                <input
                  type="text"
                  name="imageUrl"
                  defaultValue={product.imageUrl ?? ""}
                  className="border border-gray-300 rounded-lg px-3 py-1.5"
                  placeholder="Görsel URL"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-1.5"
                >
                  Kaydet
                </button>
                <button
                  type="submit"
                  formAction={deleteWithId}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-4 py-1.5"
                >
                  Sil
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
