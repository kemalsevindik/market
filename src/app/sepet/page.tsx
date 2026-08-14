import { getCart } from "@/actions/cart";
import { updateCartItemQuantity, removeFromCart } from "@/actions/cart";
import CheckoutForm from "./CheckoutForm";

export default async function SepetPage() {
  const cartItems = await getCart();
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span className="text-4xl">🛒</span>
          <p className="text-gray-500 mt-3">Sepetiniz boş.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-4 shadow-sm"
              >
                <div className="h-16 w-16 rounded-xl bg-emerald-50 overflow-hidden flex items-center justify-center text-2xl shrink-0">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    "🛍️"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.product.price.toFixed(2)} ₺ / {item.product.unit}
                  </p>
                </div>

                <form
                  action={async (formData: FormData) => {
                    "use server";
                    const quantity = parseInt(String(formData.get("quantity")), 10);
                    await updateCartItemQuantity(item.id, quantity);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="number"
                    name="quantity"
                    min={1}
                    defaultValue={item.quantity}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-center"
                  />
                  <button
                    type="submit"
                    className="text-sm text-emerald-700 font-medium hover:underline cursor-pointer"
                  >
                    Güncelle
                  </button>
                </form>

                <p className="font-semibold w-20 text-right hidden sm:block">
                  {(item.product.price * item.quantity).toFixed(2)} ₺
                </p>

                <form
                  action={async () => {
                    "use server";
                    await removeFromCart(item.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                    aria-label="Sil"
                  >
                    ✕
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-emerald-50 rounded-2xl px-5 py-4 mb-8">
            <span className="font-medium text-emerald-900">Ara Toplam</span>
            <span className="text-2xl font-bold text-emerald-800">
              {total.toFixed(2)} ₺
            </span>
          </div>

          <CheckoutForm />
        </>
      )}
    </div>
  );
}
