import { getCategories, createCategory, deleteCategory } from "@/actions/categories";

export default async function AdminKategorilerPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl">
      <form action={createCategory} className="flex gap-2 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Yeni kategori adı"
          required
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm"
        >
          Ekle
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
          >
            <span className="font-medium">{c.name}</span>
            <form
              action={async () => {
                "use server";
                await deleteCategory(c.id);
              }}
            >
              <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer">
                Sil
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
