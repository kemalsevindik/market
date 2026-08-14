import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const cards = [
    { label: "Ürünler", value: productCount, icon: "🥬" },
    { label: "Toplam Sipariş", value: orderCount, icon: "📦" },
    { label: "Bekleyen Sipariş", value: pendingOrders, icon: "⏳" },
    { label: "Kullanıcılar", value: userCount, icon: "👤" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
        >
          <span className="text-2xl">{c.icon}</span>
          <p className="text-sm text-gray-500 mt-2">{c.label}</p>
          <p className="text-3xl font-bold mt-1 text-emerald-700">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
