import { addToCart } from "@/actions/cart";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    stock: number;
    imageUrl: string | null;
    category: { name: string };
  };
};

export default function ProductCard({ product }: Props) {
  const outOfStock = product.stock <= 0;

  async function addAction() {
    "use server";
    await addToCart(product.id, 1);
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col transition-shadow">
      <div className="relative aspect-[4/3] bg-emerald-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-4xl">
            🛍️
          </div>
        )}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
          {product.category.name}
        </span>
        {outOfStock && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm">
            Stokta yok
          </span>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <h3 className="font-medium text-gray-900 leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-baseline gap-1">
          <span className="font-bold text-lg text-emerald-700">
            {product.price.toFixed(2)} ₺
          </span>
          <span className="text-xs text-gray-500">/{product.unit}</span>
        </div>

        {!outOfStock && (
          <form action={addAction}>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-medium py-2 rounded-lg cursor-pointer shadow-sm"
            >
              Sepete Ekle
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
