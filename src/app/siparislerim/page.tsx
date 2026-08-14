import { getUserOrders } from "@/actions/orders";

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  PREPARING: "Hazırlanıyor",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function SiparislerimPage() {
  const orders = await getUserOrders();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span className="text-4xl">📦</span>
          <p className="text-gray-500 mt-3">Henüz siparişiniz yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString("tr-TR")}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <ul className="text-sm text-gray-700 mb-3 divide-y divide-gray-50">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between py-1">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                  </li>
                ))}
              </ul>

              <div className="font-bold text-right text-emerald-700 border-t border-gray-100 pt-3">
                Toplam: {order.total.toFixed(2)} ₺
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
