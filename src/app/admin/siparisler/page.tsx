import { getAllOrders, updateOrderStatus } from "@/actions/orders";
import { OrderStatus } from "@prisma/client";

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

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

export default async function AdminSiparislerPage() {
  const orders = await getAllOrders();

  return (
    <div className="flex flex-col gap-4">
      {orders.length === 0 && <p className="text-gray-500">Henüz sipariş yok.</p>}

      {orders.map((order) => {
        async function changeStatus(formData: FormData) {
          "use server";
          const status = String(formData.get("status")) as OrderStatus;
          await updateOrderStatus(order.id, status);
        }

        return (
          <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
              <span>
                {order.user.name} ({order.user.email})
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-2">
              {new Date(order.createdAt).toLocaleString("tr-TR")}
            </p>

            <ul className="text-sm text-gray-700 mb-2 divide-y divide-gray-50">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-1">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-600 mb-3">
              Adres: {order.address} · Tel: {order.phone}
              {order.note && <> · Not: {order.note}</>}
            </p>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="font-bold text-emerald-700">
                Toplam: {order.total.toFixed(2)} ₺
              </span>

              <form action={changeStatus} className="flex items-center gap-2">
                <select
                  name="status"
                  defaultValue={order.status}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg"
                >
                  Güncelle
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
